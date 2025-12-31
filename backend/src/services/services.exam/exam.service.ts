import { Router, Request, Response } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { Exam, IExam } from "../../models/Exam";
import { Schedule } from "../../models/Schedule";
import { upload } from "../../utils/fileUpload";
import { generateExam } from "../services.llm/openaiClient";
import mongoose from "mongoose";

export const createUserExam = async (req: Request, res: Response) => {
  try {
    const sqlUserId = Number((req as any).user.id);
    const { scheduleId, examForeignKey, title } = req.body;

    if (!scheduleId || !examForeignKey) {
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

    const exam = await Exam.create({
      sqlUserId,
      scheduleId,
      examForeignKey,
      title: title?.trim() || "Generated Exam",
      questions,
    });

    return res.status(201).json({
      examForeignKey: exam._id.toString(),
      scheduleId,
    });
  } catch (err: any) {
    console.error("[POST /generate-exam] failed:", err);
    return res.status(500).json({ error: "Failed to generate exam" });
  }
};

export const getUserExamsByForeignKey = async (req: Request, res: Response) => {
  try {
    const sqlUserId = Number((req as any).user.id);
    const { examKey } = req.params;

    const examForeignKey = new mongoose.Types.ObjectId(examKey);

    const docs = await Exam.find({
      examForeignKey,
      sqlUserId,
    }).lean();

    if (!docs || docs.length === 0) {
      return res.status(404).json({ error: "No exams found" });
    }

    const exams = docs.map((doc) => ({
      id: doc._id.toString(),
      scheduleId: doc.scheduleId?.toString?.() ?? null,
      examForeignKey: doc.examForeignKey?.toString?.() ?? null,
      title: doc.title || "Generated Exam",
      createdAt: doc.createdAt,
      questions: doc.questions,
    }));

    return res.json({ exams });
  } catch (e: any) {
    console.error("[GET /exams/:id] failed:", e?.message || e);
    return res.status(500).json({ error: "Failed to fetch exam" });
  }
};

export const getUserExamByID = async (req: Request, res: Response) => {
  try {
    const sqlUserId = Number((req as any).user.id);
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid exam id" });
    }

    const examId = new mongoose.Types.ObjectId(id);

    const doc = await Exam.findOne({
      _id: examId,
      sqlUserId,
    }).lean();

    if (!doc) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const exam = {
      id: doc._id.toString(),
      scheduleId: doc.scheduleId?.toString?.() ?? null,
      examForeignKey: doc.examForeignKey?.toString?.() ?? null,
      title: doc.title || "Generated Exam",
      createdAt: doc.createdAt,
      questions: doc.questions,
    };

    return res.json({ exam });
  } catch (error: any) {
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

    console.log("PARSED:", { sqlUserId, scheduleId, groupKey });

    const docs = await Exam.find({ sqlUserId, scheduleId })
      .sort({ createdAt: -1 })
      .lean();

    console.log("EXAMS FOUND:", docs.length);

    const exams = groupKey
      ? docs.filter((e: any) => e.groupKey === groupKey)
      : docs;

    console.log("RETURNING:", exams.length);

    return res.json({ exams });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch exams" });
  }
};
