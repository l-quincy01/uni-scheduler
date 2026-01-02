import {
  createExamForUser,
  getExamsByForeignKey,
  getExamById,
  getExamsBySchedule,
} from "#services/exam.service/exam.service";
import { Request, Response } from "express";

export const createUserExam = async (req: Request, res: Response) => {
  try {
    const sqlUserId = Number((req as any).user.id);
    const { scheduleId, examForeignKey, title } = req.body;

    if (!scheduleId || !examForeignKey) {
      return res
        .status(400)
        .json({ error: "scheduleId and examForeignKey are required" });
    }

    const exam = await createExamForUser({
      sqlUserId,
      scheduleId,
      examForeignKey,
      title,
      files: req.files as Express.Multer.File[],
    });

    return res.status(201).json({
      examForeignKey: exam._id.toString(),
      scheduleId,
    });
  } catch (err: any) {
    if (err.code === "SCHEDULE_NOT_FOUND") {
      return res.status(404).json({ error: "Schedule not found" });
    }

    console.error("[POST /generate-exam] failed:", err);
    return res.status(500).json({ error: "Failed to generate exam" });
  }
};

export const getUserExamsByForeignKey = async (req: Request, res: Response) => {
  try {
    const sqlUserId = Number((req as any).user.id);
    const { examKey } = req.params;

    const docs = await getExamsByForeignKey({ sqlUserId, examKey });

    if (!docs || docs.length === 0) {
      return res.status(404).json({ error: "No exams found" });
    }

    return res.json({
      exams: docs.map((doc) => ({
        id: doc._id.toString(),
        scheduleId: doc.scheduleId?.toString?.() ?? null,
        examForeignKey: doc.examForeignKey?.toString?.() ?? null,
        title: doc.title || "Generated Exam",
        createdAt: doc.createdAt,
        questions: doc.questions,
      })),
    });
  } catch (e: any) {
    console.error("[GET /exams/:id] failed:", e?.message || e);
    return res.status(500).json({ error: "Failed to fetch exam" });
  }
};

export const getUserExamByID = async (req: Request, res: Response) => {
  try {
    const sqlUserId = Number((req as any).user.id);
    const { id } = req.params;

    const doc = await getExamById({ sqlUserId, id });

    if (!doc) {
      return res.status(404).json({ error: "Exam not found" });
    }

    return res.json({
      exam: {
        id: doc._id.toString(),
        scheduleId: doc.scheduleId?.toString?.() ?? null,
        examForeignKey: doc.examForeignKey?.toString?.() ?? null,
        title: doc.title || "Generated Exam",
        createdAt: doc.createdAt,
        questions: doc.questions,
      },
    });
  } catch (error: any) {
    if (error.code === "INVALID_ID") {
      return res.status(400).json({ error: "Invalid exam id" });
    }

    console.error("[GET /exam/:id] failed:", error?.message || error);
    return res.status(500).json({ error: "Failed to fetch exam" });
  }
};

export const getUserExamBySchedule = async (req: Request, res: Response) => {
  try {
    const sqlUserId = Number((req as any).user.id);
    const { scheduleId, groupKey } = req.query as {
      scheduleId?: string;
      groupKey?: string;
    };

    if (!scheduleId) {
      return res.status(400).json({ error: "scheduleId required" });
    }

    const exams = await getExamsBySchedule({
      sqlUserId,
      scheduleId,
      groupKey,
    });

    return res.json({ exams });
  } catch (err) {
    console.error("[GET /exams] failed:", err);
    return res.status(500).json({ error: "Failed to fetch exams" });
  }
};
