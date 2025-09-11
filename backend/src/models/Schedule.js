const { mongoose } = require("../db/mongo.js");

const EventSubSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    color: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { _id: true }
);

const ScheduleSchema = new mongoose.Schema(
  {
    sqlUserId: { type: Number, required: true, index: true }, // ← links to SQL user
    title: { type: String, required: true },
    timezone: { type: String, default: "Africa/Johannesburg" },
    events: { type: [EventSubSchema], default: [] },
  },
  { timestamps: true, collection: "schedules" }
);

ScheduleSchema.index({ sqlUserId: 1, createdAt: -1 });

const Schedule =
  mongoose.models.Schedule ||
  mongoose.model("Schedule", ScheduleSchema, "schedules");

module.exports = { Schedule };
