import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { requireAuth, AuthenticatedRequest } from "../middleware/requireAuth";
import { addDays } from "../utils/helpers";
import { UserProfile } from "../models/User.ts";

import "dotenv/config";

const prisma = new PrismaClient();
const router = Router();

const {
  JWT_ACCESS_SECRET = "access_secret",
  JWT_REFRESH_SECRET = "refresh_secret",
  ACCESS_TOKEN_TTL = "60m",
  REFRESH_TOKEN_TTL_DAYS = "7",
} = process.env;

// Helpers
function signAccessToken(user: { id: number; email: string }) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
}
function signRefreshToken(user: { id: number }, jti: string) {
  return jwt.sign({ sub: user.id, jti }, JWT_REFRESH_SECRET, {
    expiresIn: `${REFRESH_TOKEN_TTL_DAYS}d`,
  });
}

// Schemas
const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
  school: z.string().min(1).max(50),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Routes
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, school } =
      RegisterSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email in use" });

    const passwordHash = await argon2.hash(password);

    const user = await prisma.user.create({ data: { email, passwordHash } });
    const profileData = { firstName, lastName, phone, school };

    try {
      const { ensureMongoUserProfile } = await import(
        "../services/ensureMongoUser.js"
      );
      await ensureMongoUserProfile(user, profileData);
    } catch (e: any) {
      console.warn(
        "[register] ensureMongoUserProfile failed (non-fatal)",
        e?.message || e
      );
    }

    // Generate tokens
    const jti = uuidv4();
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user, jti);
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
        ip: req.ip,
        userAgent: req.headers["user-agent"] || null,
      },
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName,
        lastName,
        phone,
      },
      accessToken,
      refreshToken,
    });
  } catch (e: any) {
    if (e?.issues) {
      return res.status(400).json({ error: e.issues });
    }
    console.error("[/auth/register] failed:", e?.message || e);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Incorrect password or email" });

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok)
      return res.status(401).json({ error: "Incorrect password or email" });

    const jti = uuidv4();
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user, jti);

    await prisma.refreshToken.create({
      data: {
        jti,
        tokenHash: await argon2.hash(refreshToken),
        userId: user.id,
        expiresAt: addDays(
          new Date(),
          Number(process.env.REFRESH_TOKEN_TTL_DAYS)
        ),
      },
    });

    return res.status(201).json({
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch {
    res.status(400).json({ error: "Server error" });
  }
});

router.get(
  "/profile/me",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const sqlUserId = Number(req.user.id);
      const profile = await UserProfile.findOne({ sqlUserId }).lean();
      return res.json({ profile });
    } catch (err: any) {
      console.error("[/profile/me GET] failed:", err?.message || err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

router.put(
  "/profile/me",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const sqlUserId = Number(req.user.id);
      const { firstName, lastName, phone, school, avatarUrl } = req.body || {};

      const updated = await UserProfile.findOneAndUpdate(
        { sqlUserId },
        { $set: { firstName, lastName, phone, school, avatarUrl } },
        { new: true, upsert: true }
      ).lean();

      return res.json({ profile: updated });
    } catch (err: any) {
      console.error("[/profile/me PUT] failed:", err?.message || err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "Missing token" });

    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    const dbToken = await prisma.refreshToken.findUnique({
      where: { jti: payload.jti },
    });
    if (!dbToken) return res.status(401).json({ error: "Invalid token" });

    const matches = await argon2.verify(dbToken.tokenHash, refreshToken);
    if (!matches) return res.status(401).json({ error: "Invalid token" });

    const user = await prisma.user.findUnique({
      where: { id: dbToken.userId },
    });
    if (!user) return res.status(401).json({ error: "Unknown user" });

    const accessToken = signAccessToken(user);
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ error: "Invalid/expired token" });
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;

    await prisma.refreshToken.deleteMany({ where: { userId: payload.sub } });
    res.json({ ok: true });
  } catch {
    res.json({ ok: true });
  }
});

router.get("/me", requireAuth, (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;
  if (!user) {
    return res.status(500).json({ error: "User missing from request context" });
  }

  return res.json({ user });
});

export default router;
