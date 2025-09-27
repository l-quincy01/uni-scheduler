import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { Exam } from "../models/Exam";
import { Schedule } from "../models/Schedule";
import { upload } from "../utils/fileUpload";
import { generateExam } from "../services/openaiClient";
//interfaces
interface ExamDoc {
  _id: any;
  title?: string;
  scheduleId?: string;
  eventId?: string;
  groupKey?: string;
  groupTitle?: string;
  createdAt?: Date;
  questions?: any[];
}

const router = Router();

/**
 * GET /api/schedules/:id/exams
 */
router.get(
  "/schedules/:id/exams",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const sqlUserId = Number((req as any).user.id);
      const { id } = req.params;
      const { groupKey } = req.query || {};

      const docs = await Exam.find({ sqlUserId, scheduleId: id })
        .sort({ createdAt: -1 })
        .lean();

      const scheduleDoc = await Schedule.findOne({ _id: id, sqlUserId }).lean();

      function subjectFromEventTitle(t: string) {
        const raw = String(t || "");
        const m = raw.match(
          /^(?:\s*(?:Study|Exam):\s*)?(.+?)(?:\s*\(Session\s*\d+\)\s*)?$/i
        );
        const subject = (m ? m[1] : raw)
          .replace(/^(?:Study|Exam):\s*/i, "")
          .replace(/\s*\(Session\s*\d+\)\s*$/i, "")
          .trim();
        const key = subject
          .toLowerCase()
          .normalize("NFKD")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        return { subject, key };
      }

      const resolveGroup = (e: any) => {
        if (e.groupKey && e.groupTitle)
          return { key: e.groupKey, title: e.groupTitle };
        const all = [
          ...(scheduleDoc?.events || []),
          ...(scheduleDoc?.exams || []),
        ];
        const ev = all.find((x: any) => String(x._id) === String(e.eventId));
        if (!ev)
          return { key: e.groupKey ?? null, title: e.groupTitle ?? null };
        const { subject, key } = subjectFromEventTitle(ev.title || "");
        return { key, title: subject };
      };

      const hydrated = docs.map((e: any) => {
        const g = resolveGroup(e);
        return {
          id: e._id.toString(),
          title: e.title || "Generated Exam",
          scheduleId: e.scheduleId?.toString?.() ?? String(id),
          eventId: e.eventId?.toString?.() ?? null,
          groupKey: g.key,
          groupTitle: g.title,
          createdAt: e.createdAt,
        };
      });

      const exams = groupKey
        ? hydrated.filter((e) => e.groupKey === String(groupKey))
        : hydrated;
      return res.json({ exams });
    } catch (e: any) {
      console.error("[GET /schedules/:id/exams] failed:", e?.message || e);
      return res.status(500).json({ error: "Failed to fetch exams" });
    }
  }
);

/**
 * GET /api/exams
 */
router.get("/exams", requireAuth, async (req: Request, res: Response) => {
  try {
    const sqlUserId = Number((req as any).user.id);
    const { scheduleId, groupKey } = req.query || {};

    const filter: any = { sqlUserId };
    if (scheduleId) filter.scheduleId = String(scheduleId);

    const docs = await Exam.find(filter).sort({ createdAt: -1 }).lean();

    const cache = new Map();
    async function getSchedule(sid: string) {
      if (cache.has(sid)) return cache.get(sid);
      const s = await Schedule.findById(sid).lean();
      cache.set(sid, s);
      return s;
    }

    function subjectFromEventTitle(t: string) {
      const raw = String(t || "");
      const m = raw.match(
        /^(?:\s*(?:Study|Exam):\s*)?(.+?)(?:\s*\(Session\s*\d+\)\s*)?$/i
      );
      const subject = (m ? m[1] : raw)
        .replace(/^(?:Study|Exam):\s*/i, "")
        .replace(/\s*\(Session\s*\d+\)\s*$/i, "")
        .trim();
      const key = subject
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return { subject, key };
    }

    const hydrated = await Promise.all(
      docs.map(async (e: any) => {
        let key = e.groupKey ?? null;
        let title = e.groupTitle ?? null;
        if (!key || !title) {
          const s = await getSchedule(e.scheduleId);
          const all = [...(s?.events || []), ...(s?.exams || [])];
          const ev = all.find((x: any) => String(x._id) === String(e.eventId));
          if (ev) {
            const g = subjectFromEventTitle(ev.title || "");
            key = key || g.key;
            title = title || g.subject;
          }
        }
        return {
          id: e._id.toString(),
          title: e.title || "Generated Exam",
          scheduleId: e.scheduleId?.toString?.() ?? null,
          eventId: e.eventId?.toString?.() ?? null,
          groupKey: key,
          groupTitle: title,
          createdAt: e.createdAt,
        };
      })
    );

    const exams = groupKey
      ? hydrated.filter((e) => e.groupKey === String(groupKey))
      : hydrated;
    return res.json({ exams });
  } catch (e: any) {
    console.error("[GET /exams] failed:", e?.message || e);
    return res.status(500).json({ error: "Failed to fetch exams" });
  }
});

/**
 * GET /api/exams/:id
 */
router.get("/exams/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const sqlUserId = Number((req as any).user.id);
    const { id } = req.params;
    const doc = await Exam.findOne({ _id: id, sqlUserId }).lean<ExamDoc>();

    if (!doc) return res.status(404).json({ error: "Exam not found" });

    const exam = {
      id: doc._id.toString(),
      title: doc.title || "Generated Exam",
      scheduleId: doc.scheduleId?.toString?.() ?? null,
      eventId: doc.eventId?.toString?.() ?? null,
      groupKey: doc.groupKey ?? null,
      groupTitle: doc.groupTitle ?? null,
      createdAt: doc.createdAt,
      questions: doc.questions,
    };
    return res.json({ exam });
  } catch (e: any) {
    console.error("[GET /exams/:id] failed:", e?.message || e);
    return res.status(500).json({ error: "Failed to fetch exam" });
  }
});

/**
 * POST /api/generate-exam
 */
router.post(
  "/generate-exam",
  requireAuth,
  upload.array("files", 5),
  async (req: Request, res: Response) => {
    try {
      const sqlUserId = Number((req as any).user.id);
      const {
        scheduleId,
        eventId,
        title,
        groupKey: bodyGroupKey,
        groupTitle: bodyGroupTitle,
      } = req.body;

      if (!scheduleId || !eventId) {
        return res
          .status(400)
          .json({ error: "scheduleId and eventId are required" });
      }

      const questions = await generateExam(req.files as Express.Multer.File[]);

      const scheduleDoc = await Schedule.findOne({
        _id: scheduleId,
        sqlUserId,
      }).lean();

      if (!scheduleDoc)
        return res.status(404).json({ error: "Schedule not found" });

      const ev = (scheduleDoc.events || []).find(
        (e: any) => String(e._id) === String(eventId)
      );
      if (!ev)
        return res.status(404).json({ error: "Event not found in schedule" });

      const rawTitle = ev.title || "";
      const subject = (() => {
        const m = String(rawTitle).match(
          /^(?:\s*(?:Study|Exam):\s*)?(.+?)(?:\s*\(Session\s*\d+\)\s*)?$/i
        );
        if (m) return m[1].trim();
        return String(rawTitle)
          .replace(/^(?:Study|Exam):\s*/i, "")
          .replace(/\s*\(Session\s*\d+\)\s*$/i, "")
          .trim();
      })();

      const computedKey = subject
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const groupKey = bodyGroupKey ? String(bodyGroupKey) : computedKey;
      const groupTitle = bodyGroupTitle ? String(bodyGroupTitle) : subject;

      // Save to Mongo
      const exam = await Exam.create({
        sqlUserId,
        scheduleId,
        eventId,
        groupKey,
        groupTitle,
        title: title?.trim() || "Generated Exam",
        questions,
      });

      return res.status(201).json({
        examId: exam._id.toString(),
        scheduleId,
        eventId,
        groupKey,
        groupTitle,
      });
    } catch (err: any) {
      console.error("[POST /generate-exam] failed:", err);
      return res.status(500).json({ error: "Failed to generate exam" });
    }
  }
);

export default router;
