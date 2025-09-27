import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { Schedule } from "../models/Schedule";
import { UserProfile } from "../models/User";
import { generateSchedule } from "../services/openaiClient";

const router = Router();

/**
 * POST /api/schedules

 */
router.post("/schedules", requireAuth, async (req: Request, res: Response) => {
  try {
    const sqlUserId = Number((req as any).user.id);
    const {
      title,
      timezone = "Africa/Johannesburg",
      events = [],
      exams = [],
    } = req.body || {};

    const schedule = await Schedule.create({
      sqlUserId,
      title,
      timezone,
      events,
      exams,
    });

    return res.status(201).json({ scheduleId: schedule._id.toString() });
  } catch (e: any) {
    console.error("[POST /schedules] failed:", e?.message || e);
    return res.status(500).json({ error: "Failed to create schedule" });
  }
});

/**
 * GET /api/schedules
 */
router.get("/schedules", requireAuth, async (req: Request, res: Response) => {
  try {
    const sqlUserId = Number((req as any).user.id);
    const docs = await Schedule.find({ sqlUserId }).lean();

    const schedules = docs.map((s: any) => ({
      id: s._id.toString(),
      title: s.title,
      timezone: s.timezone || "Africa/Johannesburg",
      events: (s.events || []).map((e: any) => ({
        title: e.title,
        description: e.description || "",
        color: e.color,
        startDate: new Date(e.startDate).toISOString(),
        endDate: new Date(e.endDate).toISOString(),
      })),
      exams: (s.exams || []).map((e: any) => ({
        title: e.title,
        description: e.description || "",
        color: e.color,
        startDate: new Date(e.startDate).toISOString(),
        endDate: new Date(e.endDate).toISOString(),
      })),
    }));

    return res.json({ schedules });
  } catch (e: any) {
    console.error("[GET /schedules] failed:", e?.message || e);
    return res.status(500).json({ error: "Failed to fetch schedules" });
  }
});

/**
 * GET /api/schedules/:id
 */
router.get(
  "/schedules/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const sqlUserId = Number((req as any).user.id);
      const { id } = req.params;

      const s = await Schedule.findOne({ _id: id, sqlUserId }).lean();
      if (!s) return res.status(404).json({ error: "Schedule not found" });

      const schedule = {
        id: s._id.toString(),
        title: s.title,
        timezone: s.timezone || "Africa/Johannesburg",
        events: (s.events || []).map((e: any) => ({
          id: e._id ? e._id.toString() : undefined,
          title: e.title,
          description: e.description || "",
          color: e.color,
          startDate: new Date(e.startDate).toISOString(),
          endDate: new Date(e.endDate).toISOString(),
        })),
        exams: (s.exams || []).map((e: any) => ({
          id: e._id ? e._id.toString() : undefined,
          title: e.title,
          description: e.description || "",
          color: e.color,
          startDate: new Date(e.startDate).toISOString(),
          endDate: new Date(e.endDate).toISOString(),
        })),
      };

      return res.json({ schedule });
    } catch (e: any) {
      console.error("[GET /schedules/:id] failed:", e?.message || e);
      return res.status(500).json({ error: "Failed to fetch schedule" });
    }
  }
);

/**
 * GET /api/calendar/events
 */
router.get(
  "/calendar/events",
  requireAuth,
  async (req: Request, res: Response) => {
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
  }
);

/**
 * POST /api/generate-schedule
 */
router.post(
  "/generate-schedule",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const sqlUserId = Number((req as any).user.id);
      const { scheduleTitle, selectedModules } = req.body;

      if (!scheduleTitle || !Array.isArray(selectedModules)) {
        return res.status(400).json({ error: "Missing input data" });
      }

      const generated = await generateSchedule(scheduleTitle, selectedModules);

      const savedSchedules = await Promise.all(
        generated.schedules.map((s: any) =>
          Schedule.create({
            sqlUserId,
            title: scheduleTitle,
            timezone: s.timezone,
            events: s.events,
            exams: s.exams,
          })
        )
      );

      return res.status(201).json({
        message: "Schedule generated and saved",
        schedules: savedSchedules.map((s) => ({
          id: s._id.toString(),
          title: s.title,
          timezone: s.timezone,
        })),
      });
    } catch (err: any) {
      console.error("[POST /generate-schedule] failed:", err);
      return res.status(500).json({ error: "Failed to generate schedule" });
    }
  }
);

export default router;
