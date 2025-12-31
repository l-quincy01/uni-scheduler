import { mongoose } from "../db/mongo";
import { Schema, Document, Model } from "mongoose";

export interface IExam {
  title: string;
  date: Date;
  time: string;
}

export interface IModule extends Document {
  category: string;
  title: string;
  date: Date;
  time: string;
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new Schema<IModule>(
  {
    category: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "rhodes_modules_timetable",
  }
);

ModuleSchema.index({ category: 1, date: 1 });

export const Module: Model<IModule> =
  mongoose.models.Module ||
  mongoose.model<IModule>("rhodes_modules_timetable", ModuleSchema);
