import { mongoose } from "../db/mongo";
import { Schema, Document, Model } from "mongoose";

//interfaces
export interface IEvent {
  title: string;
  description?: string;
  color: string;
  startDate: Date;
  endDate: Date;
}

export interface ISchedule extends Document {
  sqlUserId: number; // Links to SQL user
  title: string;
  timezone: string;
  events: IEvent[];
  exams: IEvent[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSubSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    color: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { _id: true }
);

const ScheduleSchema = new Schema<ISchedule>(
  {
    sqlUserId: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    timezone: { type: String, default: "Africa/Johannesburg" },
    events: { type: [EventSubSchema], default: [] },
    exams: { type: [EventSubSchema], default: [] },
  },
  { timestamps: true, collection: "schedules" }
);

ScheduleSchema.index({ sqlUserId: 1, createdAt: -1 });

export const Schedule: Model<ISchedule> =
  mongoose.models.Schedule ||
  mongoose.model<ISchedule>("Schedule", ScheduleSchema, "schedules");
