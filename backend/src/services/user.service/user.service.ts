import { UserProfile } from "../../models/User";
import { PrismaClient } from "@prisma/client";

const avatarUrls = [
  "https://i.redd.it/tbhgxr7adj7f1.png",
  "https://i.redd.it/o9xjbxagdj7f1.png",
  "https://i.redd.it/uqvmqo1cdj7f1.png",
];
const prisma = new PrismaClient();

type UserProfilePayload = {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  school: string | null;
  avatarUrl: string | null;
  _id?: string;
};

export async function createUserProfile(params: {
  sqlUserId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  school?: string;
  avatarUrl: string;
}) {
  return UserProfile.create({
    sqlUserId: params.sqlUserId,
    firstName: params.firstName ?? null,
    lastName: params.lastName ?? null,
    email: params.email ?? null,
    phone: params.phone ?? null,
    school: params.school ?? null,
    avatarUrl: avatarUrls[Math.floor(Math.random() * 3)],
  });
}

export function getUserProfile(data: {
  user: { id: number; email: string };
  profile?: any;
}): UserProfilePayload {
  const { user, profile } = data;
  return {
    id: user.id,
    email: user.email,
    firstName: profile?.firstName ?? null,
    lastName: profile?.lastName ?? null,
    phone: profile?.phone ?? null,
    school: profile?.school ?? null,
    avatarUrl: profile?.avatarUrl ?? null,
    _id: profile?._id?.toString(),
  };
}

export async function updateSqlUser(
  userId: number,
  updates: {
    email?: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    school?: string | null;
    avatarUrl?: string | null;
  }
) {
  const current = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!current) {
    throw new Error("USER_NOT_FOUND");
  }

  if (updates.email && updates.email !== current.email) {
    const existing = await prisma.user.findUnique({
      where: { email: updates.email },
    });

    if (existing && existing.id !== userId) {
      throw new Error("EMAIL_IN_USE");
    }

    return prisma.user.update({
      where: { id: userId },
      data: { email: updates.email },
    });
  }

  return current;
}

export async function upsertMongoUserProfile(
  userId: number,
  email: string,
  updates: {
    email?: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    school?: string | null;
    avatarUrl?: string | null;
  }
) {
  const payload: Record<string, any> = { email };

  if (updates.firstName !== undefined) payload.firstName = updates.firstName;
  if (updates.lastName !== undefined) payload.lastName = updates.lastName;
  if (updates.phone !== undefined) payload.phone = updates.phone;
  if (updates.school !== undefined) payload.school = updates.school;
  if (updates.avatarUrl !== undefined) payload.avatarUrl = updates.avatarUrl;

  return UserProfile.findOneAndUpdate(
    { sqlUserId: userId },
    { $set: payload, $setOnInsert: { sqlUserId: userId } },
    { new: true, upsert: true }
  ).lean();
}
