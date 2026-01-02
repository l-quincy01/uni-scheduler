import { mongoose } from "#db/mongo";
import { Schema, Document, Model } from "mongoose";

export interface IUserProfile extends Document {
  sqlUserId: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  school?: string | null;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;

  name: string;
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    sqlUserId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    firstName: { type: String, trim: true, default: null },
    lastName: { type: String, trim: true, default: null },
    email: { type: String, trim: true, lowercase: true, index: true },
    phone: { type: String, default: null },
    school: { type: String, default: null },
    avatarUrl: { type: String, default: null },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

UserProfileSchema.virtual("name").get(function () {
  return `${this.firstName ?? ""} ${this.lastName ?? ""}`.trim();
});

UserProfileSchema.set("toJSON", { virtuals: true });

export const UserProfile: Model<IUserProfile> =
  mongoose.models.UserProfile ??
  mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);
