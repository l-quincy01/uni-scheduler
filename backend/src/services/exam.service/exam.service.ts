import mongoose from "mongoose";

import { generateExam } from "../llm.service/openaiClient";
import { Schedule } from "#models/Schedule";
import { Exam } from "#models/Exam";

export async function createExamForUser({
  sqlUserId,
  scheduleId,
  examForeignKey,
  title,
  files,
}) {
  const questions = await generateExam(files);

  const scheduleDoc = await Schedule.findOne({
    _id: scheduleId,
    sqlUserId,
  }).lean();

  if (!scheduleDoc) {
    const err: any = new Error("Schedule not found");
    err.code = "SCHEDULE_NOT_FOUND";
    throw err;
  }

  const exam = await Exam.create({
    sqlUserId,
    scheduleId,
    examForeignKey,
    title: title?.trim() || "Generated Exam",
    questions,
  });

  return exam;
}

export async function getExamsByForeignKey({ sqlUserId, examKey }) {
  const examForeignKey = new mongoose.Types.ObjectId(examKey);

  const docs = await Exam.find({
    examForeignKey,
    sqlUserId,
  }).lean();

  return docs;
}

export async function getExamById({ sqlUserId, id }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err: any = new Error("Invalid ID");
    err.code = "INVALID_ID";
    throw err;
  }

  const examId = new mongoose.Types.ObjectId(id);

  const doc = await Exam.findOne({
    _id: examId,
    sqlUserId,
  }).lean();

  return doc;
}

export async function getExamsBySchedule({ sqlUserId, scheduleId, groupKey }) {
  const docs = await Exam.find({
    sqlUserId,
    scheduleId,
  })
    .sort({ createdAt: -1 })
    .lean();

  return groupKey ? docs.filter((e: any) => e.groupKey === groupKey) : docs;
}
