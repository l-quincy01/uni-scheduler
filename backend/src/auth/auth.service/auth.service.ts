import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import {
  createUserProfile,
  getUserProfile,
  updateSqlUser,
  upsertMongoUserProfile,
} from "#auth/auth.service/user.service.js";
import { UserProfile } from "#models/User.js";
import { Schedule } from "#models/Schedule.js";
import { Exam } from "#models/Exam.js";
import { addDays } from "../../utils/helpers.js";
import { signAccessToken, signRefreshToken } from "../auth.utils/auth.utils.js";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const { JWT_REFRESH_SECRET } = process.env as { JWT_REFRESH_SECRET: string };

export async function registerUserService(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  school?: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new Error("EMAIL_IN_USE");
  }

  const passwordHash = await argon2.hash(input.password);

  // cretae user
  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
    },
  });

  try {
    await createUserProfile({
      sqlUserId: user.id,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      school: input.school,
    });
  } catch (err) {
    await prisma.user.delete({ where: { id: user.id } });
    throw err;
  }

  // tokens
  const jti = uuidv4();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user.id, jti);
  const tokenHash = await argon2.hash(refreshToken);

  await prisma.refreshToken.create({
    data: {
      jti,
      tokenHash,
      userId: user.id,
      expiresAt: addDays(
        new Date(),
        Number(process.env.REFRESH_TOKEN_TTL_DAYS)
      ),
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
    },
    accessToken,
    refreshToken,
  };
}

export async function loginUserService(input: {
  email: string;
  password: string;
  ip?: string;
  userAgent?: string | null;
}) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordValid = await argon2.verify(user.passwordHash, input.password);

  if (!passwordValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // tokens
  const jti = uuidv4();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user.id, jti);
  const tokenHash = await argon2.hash(refreshToken);

  await prisma.refreshToken.create({
    data: {
      jti,
      tokenHash,
      userId: user.id,
      expiresAt: addDays(
        new Date(),
        Number(process.env.REFRESH_TOKEN_TTL_DAYS)
      ),
      ip: input.ip,
      userAgent: input.userAgent ?? null,
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
}

export async function getUserService(userId: number) {
  const [user, profile] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    UserProfile.findOne({ sqlUserId: userId }).lean(),
  ]);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return getUserProfile({ user, profile });
}

export async function updateUserService(
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
  const user = await updateSqlUser(userId, updates);

  const profile = await upsertMongoUserProfile(userId, user.email, updates);

  return getUserProfile({
    user,
    profile,
  });
}

export async function deleteUserService(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  await prisma.$transaction([
    prisma.refreshToken.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  await Promise.all([
    UserProfile.deleteOne({ sqlUserId: userId }),
    Schedule.deleteMany({ sqlUserId: userId }),
    Exam.deleteMany({ sqlUserId: userId }),
  ]);

  return true;
}

export async function refreshAccessToken(refreshToken: string) {
  if (!refreshToken) throw new Error("MISSING_TOKEN");

  const payload: any = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

  const dbToken = await prisma.refreshToken.findUnique({
    where: { jti: payload?.jti },
  });

  if (!dbToken) throw new Error("INVALID_TOKEN");

  const matches = await argon2.verify(dbToken.tokenHash, refreshToken);
  if (!matches) throw new Error("INVALID_TOKEN");

  const user = await prisma.user.findUnique({
    where: { id: dbToken.userId },
  });

  if (!user) throw new Error("UNKNOWN_USER");

  const accessToken = signAccessToken(user);

  return { accessToken };
}

export async function logout(refreshToken: string) {
  if (!refreshToken) return;

  try {
    const payload: any = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    await prisma.refreshToken.deleteMany({
      where: { userId: payload.sub },
    });
  } catch {
    // swallow errors — logout is idempotent
  }
}
