import { mongoose } from "../db/mongo";
import { Schedule } from "./Schedule";
import { Schema, Document, Model } from "mongoose";

export interface IExam extends Document {
  sqlUserId: number;
  scheduleId: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  groupKey?: string;
  groupTitle?: string;
  title: string;
  questions: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

//Schema
const ExamSchema = new Schema<IExam>(
  {
    // Ownership
    sqlUserId: { type: Number, required: true, index: true },
    scheduleId: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
      index: true,
    },
    eventId: { type: Schema.Types.ObjectId, required: true, index: true },

    //For Kanban
    groupKey: { type: String, index: true },
    groupTitle: { type: String },

    title: { type: String, trim: true, default: "Generated Exam" },

    questions: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

/**
 * Extract a subject from an event title and build a slug key.
 */
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

ExamSchema.pre<IExam>("save", async function populateGroup(next) {
  try {
    if (this.groupKey && this.groupTitle) return next();
    if (!this.scheduleId || !this.eventId) return next();

    const schedule = await Schedule.findById(this.scheduleId).lean();
    if (!schedule) return next();

    const evList = [...(schedule.events || []), ...(schedule.exams || [])];
    const ev = evList.find((e: any) => String(e._id) === String(this.eventId));
    if (!ev) return next();

    const { subject, key } = subjectFromEventTitle(ev.title || "");
    if (!this.groupTitle) this.groupTitle = subject;
    if (!this.groupKey) this.groupKey = key;

    return next();
  } catch (_e) {
    return next();
  }
});

export const Exam: Model<IExam> =
  mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema);
