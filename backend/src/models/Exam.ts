import { mongoose } from "#db/mongo";
import { Schedule } from "./Schedule";
import { Schema, Document, Model } from "mongoose";

export interface IExam extends Document {
  sqlUserId: number;
  scheduleId: Schema.Types.ObjectId;
  examForeignKey: Schema.Types.ObjectId;
  title: string;
  questions: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema<IExam>(
  {
    // owner
    sqlUserId: { type: Number, required: true, index: true },
    scheduleId: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
      index: true,
    },
    //referential link
    examForeignKey: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    title: { type: String, trim: true, default: "Generated Exam" },

    questions: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,

    collection: "user_exams",
  }
);

export const Exam: Model<IExam> =
  mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema);
