import { Router, Request, Response } from "express";
import { Schedule } from "../../models/Schedule";
import { UserProfile } from "../../models/User";

export const getCalendarEvents = async (req: Request, res: Response) => {
  try {
    const sqlUserId = Number((req as any).user.id);

    const [schedules, profile] = await Promise.all([
      Schedule.find({ sqlUserId }).lean(),
      UserProfile.findOne({ sqlUserId }).lean(),
    ]);

    const events = schedules.flatMap((s: any) => {
      const mapItem = (e: any) => ({
        id: e._id.toString(),
        scheduleId: s._id.toString(),
        title: e.title,
        description: e.description,
        color: e.color,
        startDate: new Date(e.startDate).toISOString(),
        endDate: new Date(e.endDate).toISOString(),
        user: profile
          ? {
              _id: profile._id.toString(),
              firstName: profile.firstName,
              lastName: profile.lastName,
              email: profile.email,
              avatarUrl: profile.avatarUrl,
            }
          : null,
      });
      return [
        ...(Array.isArray(s.events) ? s.events.map(mapItem) : []),
        ...(Array.isArray(s.exams) ? s.exams.map(mapItem) : []),
      ];
    });

    return res.json(events);
  } catch (e: any) {
    console.error("[GET /calendar/events] failed:", e?.message || e);
    return res.status(500).json({ error: "Failed to fetch events" });
  }
};
