const { mongoose } = require("../db/mongo.js");

const collection = process.env.MONGO_COLLECTION || "user_schedules";

const UserProfileSchema = new mongoose.Schema(
  {
    // ← SQL user id; your single source of truth for identity
    sqlUserId: { type: Number, required: true, unique: true, index: true },

    firstName: { type: String, default: null, trim: true },
    lastName: { type: String, default: null, trim: true },
    email: { type: String, index: true, trim: true, lowercase: true },
    phone: { type: String, default: null },
    school: { type: String, default: null },
    avatarUrl: { type: String, default: null },
  },
  { timestamps: true, collection }
);

UserProfileSchema.virtual("name").get(function () {
  return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});
UserProfileSchema.set("toJSON", { virtuals: true });

const UserProfile =
  mongoose.models.UserProfile ||
  mongoose.model("UserProfile", UserProfileSchema, collection);

module.exports = { UserProfile };
