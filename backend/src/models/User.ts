import { mongoose } from "../db/mongo";
import { Schema, Document, Model } from "mongoose";

const collection = process.env.MONGO_COLLECTION || "user_schedules";

//interface
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

UserProfileSchema.virtual("name").get(function (this: IUserProfile) {
  return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});

UserProfileSchema.set("toJSON", { virtuals: true });

export const UserProfile: Model<IUserProfile> =
  mongoose.models.UserProfile ||
  mongoose.model<IUserProfile>("UserProfile", UserProfileSchema, collection);
