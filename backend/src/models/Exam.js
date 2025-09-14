const { mongoose } = require("../db/mongo.js");
const { Schema } = mongoose;

const ExamSchema = new Schema(
  {
    // Ownership & placement (required + indexed)
    sqlUserId: { type: Number, required: true, index: true },
    scheduleId: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
      index: true,
    },
    eventId: { type: Schema.Types.ObjectId, required: true, index: true },

    // Content
    title: { type: String, trim: true, default: "Generated Exam" },

    // Keep questions flexible; your API schema already validates shape
    questions: {},
  },
  { timestamps: true }
);

// Uniqueness: only one exam per (user, schedule, event)
ExamSchema.index({ sqlUserId: 1, scheduleId: 1, eventId: 1 }, { unique: true });

const Exam = mongoose.models.Exam || mongoose.model("Exam", ExamSchema);
module.exports = { Exam };
