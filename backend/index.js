require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { v4: uuidv4 } = require("uuid");
const { PrismaClient } = require("@prisma/client");
// const { requireAuth } = { requireAuth };

const prisma = new PrismaClient();
const app = express();

const {
  PORT = 4000,
  CORS_ORIGIN = "*",
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_TTL = "15m",
  REFRESH_TOKEN_TTL_DAYS = "7",
  NODE_ENV = "development",
} = process.env;

app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

// Simple, static imports for side-project ergonomics
const { connectMongo } = require("./src/db/mongo.js");
const { ensureMongoUserProfile } = require("./src/services/ensureMongoUser.js");
const { UserProfile } = require("./src/models/User.js");
const { Schedule } = require("./src/models/Schedule.js");

connectMongo().catch((err) => {
  console.error("[mongo] failed to connect:", err);
});

// Helpers
function signAccessToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
}
function signRefreshToken(user, jti) {
  return jwt.sign({ sub: user.id, jti }, JWT_REFRESH_SECRET, {
    expiresIn: `${REFRESH_TOKEN_TTL_DAYS}d`,
  });
}
const REFRESH_TTL_MS =
  Number(REFRESH_TOKEN_TTL_DAYS || 7) * 24 * 60 * 60 * 1000;

// Auth middleware
async function requireAuth(req, res, next) {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET);
    // Destroy-all semantics: if user has no active refresh tokens, treat as logged out
    try {
      const activeCount = await prisma.refreshToken.count({
        where: { userId: Number(payload.sub), revoked: false },
      });
      if (activeCount === 0)
        return res.status(401).json({ error: "Logged out" });
    } catch (e) {
      // If DB check fails, be safe and deny
      return res.status(401).json({ error: "Auth check failed" });
    }
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid/expired token" });
  }
}

// Validation (zod)
const { z } = require("zod");
const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
});
const LoginSchema = RegisterSchema;

// Routes --------------------------------------------------------------------------------------------
app.get("/health", (req, res) => res.json({ ok: true }));

// single CORS middleware above is sufficient

app.post("/auth/register", async (req, res) => {
  try {
    const { email, password } = RegisterSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email in use" });

    const passwordHash = await argon2.hash(password);
    const user = await prisma.user.create({ data: { email, passwordHash } });
    // ensure Mongo profile exists for this SQL user (best effort)
    try {
      await ensureMongoUserProfile(user);
    } catch {}

    const jti = uuidv4();
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user, jti);
    const tokenHash = await argon2.hash(refreshToken);

    await prisma.refreshToken.create({
      data: {
        jti,
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
        ip: req.ip,
        userAgent: req.headers["user-agent"] || null,
      },
    });

    return res.status(201).json({
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (e) {
    if (e?.issues) return res.status(400).json({ error: e.issues });
    return res.status(500).json({ error: "Server error" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    try {
      await ensureMongoUserProfile(user);
    } catch {}

    const jti = uuidv4();
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user, jti);
    const tokenHash = await argon2.hash(refreshToken);

    await prisma.refreshToken.create({
      data: {
        jti,
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
        ip: req.ip,
        userAgent: req.headers["user-agent"] || null,
      },
    });

    return res.json({
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (e) {
    if (e?.issues) return res.status(400).json({ error: e.issues });
    return res.status(500).json({ error: "Server error" });
  }
});

app.post("/auth/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken)
      return res.status(400).json({ error: "Missing refreshToken" });

    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const dbToken = await prisma.refreshToken.findUnique({
      where: { jti: payload.jti },
    });
    if (!dbToken || dbToken.revoked)
      return res.status(401).json({ error: "Invalid token" });
    if (dbToken.expiresAt < new Date())
      return res.status(401).json({ error: "Expired token" });

    const matches = await argon2.verify(dbToken.tokenHash, refreshToken);
    if (!matches) return res.status(401).json({ error: "Invalid token" });

    const user = await prisma.user.findUnique({
      where: { id: dbToken.userId },
    });
    if (!user) return res.status(401).json({ error: "Unknown user" });

    const accessToken = signAccessToken(user);
    // (Optional) rotate refresh token here for stronger security
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ error: "Invalid/expired token" });
  }
});

app.post("/auth/logout", async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken)
    return res.status(400).json({ error: "Missing refreshToken" });

  try {
    // Verify signature + expiry
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    if (!payload?.jti)
      return res.status(400).json({ error: "Invalid token payload" });

    // Look up token record to get userId (idempotent if missing)
    const dbToken = await prisma.refreshToken.findUnique({
      where: { jti: payload.jti },
    });
    if (!dbToken) return res.json({ ok: true });

    // Ensure presented token matches stored hash (ignore if rotated)
    const matches = await argon2
      .verify(dbToken.tokenHash, refreshToken)
      .catch(() => false);
    if (!matches) return res.json({ ok: true });

    // Destroy all refresh tokens for this user (logout everywhere)
    await prisma.refreshToken.deleteMany({
      where: { userId: dbToken.userId },
    });

    return res.json({ ok: true });
  } catch (e) {
    // If token is already expired/invalid, still clear client state
    return res.status(401).json({ error: "Invalid/expired token" });
  }
});
app.get("/auth/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.user.id) },
    select: { id: true, email: true, createdAt: true },
  });
  return res.json({ user });
});

// GET /profile/me
app.get("/profile/me", requireAuth, async (req, res) => {
  const sqlUserId = Number(req.user.id);
  const profile = await UserProfile.findOne({ sqlUserId }).lean();
  return res.json({ profile });
});

// PUT /profile/me
app.put("/profile/me", requireAuth, async (req, res) => {
  const sqlUserId = Number(req.user.id);
  const { firstName, lastName, phone, school, avatarUrl } = req.body || {};

  const updated = await UserProfile.findOneAndUpdate(
    { sqlUserId },
    { $set: { firstName, lastName, phone, school, avatarUrl } },
    { new: true, upsert: true }
  ).lean();

  return res.json({ profile: updated });
});

// POST /api/schedules
app.post("/api/schedules", requireAuth, async (req, res) => {
  const sqlUserId = Number(req.user.id);
  const {
    title,
    timezone = "Africa/Johannesburg",
    events = [],
  } = req.body || {};

  const schedule = await Schedule.create({
    sqlUserId,
    title,
    timezone,
    events,
  });
  return res.status(201).json({ scheduleId: schedule._id.toString() });
});

// GET /api/calendar/events  (flatten events for your CalendarProvider)
app.get("/api/calendar/events", requireAuth, async (req, res) => {
  const sqlUserId = Number(req.user.id);

  const [schedules, profile] = await Promise.all([
    Schedule.find({ sqlUserId }).lean(),
    UserProfile.findOne({ sqlUserId }).lean(),
  ]);

  const events = schedules.flatMap((s) =>
    (s.events || []).map((e) => ({
      id: e._id.toString(),
      scheduleId: s._id.toString(),
      title: e.title,
      description: e.description,
      color: e.color,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate.toISOString(),
      user: profile
        ? {
            _id: profile._id.toString(),
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            avatarUrl: profile.avatarUrl,
          }
        : null,
    }))
  );

  res.json(events);
});

app.listen(PORT, () => {
  console.log(`Auth service on http://localhost:${PORT}`);
});
