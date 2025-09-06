require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { v4: uuidv4 } = require("uuid");
const { PrismaClient } = require("@prisma/client");

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
function addDays(d, days) {
  const x = new Date(d);
  x.setDate(x.getDate() + Number(REFRESH_TOKEN_TTL_DAYS));
  return x;
}

// Auth middleware
function requireAuth(req, res, next) {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET);
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

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? "*",
    credentials: true,
  })
);

app.post("/auth/register", async (req, res) => {
  try {
    const { email, password } = RegisterSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email in use" });

    const passwordHash = await argon2.hash(password);
    const user = await prisma.user.create({ data: { email, passwordHash } });

    const jti = uuidv4();
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user, jti);
    const tokenHash = await argon2.hash(refreshToken);

    await prisma.refreshToken.create({
      data: {
        jti,
        tokenHash,
        userId: user.id,
        expiresAt: addDays(new Date(), REFRESH_TOKEN_TTL_DAYS),
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

    const jti = uuidv4();
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user, jti);
    const tokenHash = await argon2.hash(refreshToken);

    await prisma.refreshToken.create({
      data: {
        jti,
        tokenHash,
        userId: user.id,
        expiresAt: addDays(new Date(), REFRESH_TOKEN_TTL_DAYS),
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
    const payload = jwt.decode(refreshToken);
    if (payload?.jti) {
      await prisma.refreshToken.updateMany({
        where: { jti: payload.jti },
        data: { revoked: true },
      });
    }
  } catch {}
  return res.json({ ok: true });
});

app.get("/auth/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.user.id) },
    select: { id: true, email: true, createdAt: true },
  });
  return res.json({ user });
});

app.listen(PORT, () => {
  console.log(`Auth service on http://localhost:${PORT}`);
});
