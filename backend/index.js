require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { v4: uuidv4 } = require("uuid");
const { PrismaClient } = require("@prisma/client");
const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { Exam } = require("./src/models/Exam.js");
const prisma = new PrismaClient();
const app = express();
const openai = new OpenAI({});

const {
  PORT = 4000,
  CORS_ORIGIN = "*",
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_TTL = "1d",
  REFRESH_TOKEN_TTL_DAYS = "7",
  NODE_ENV = "development",
} = process.env;

app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

const esm = (p) => import(p);
esm("./src/db/mongo.js")
  .then((m) => m.connectMongo())
  .catch((err) => {
    console.error("[mongo] failed to connect:", err);
  });

const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^\w.\-]+/g, "_");
      cb(null, Date.now() + "_" + safe);
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024, files: 6 },
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
function addDays(d, days) {
  const x = new Date(d);
  x.setDate(x.getDate() + Number(REFRESH_TOKEN_TTL_DAYS));
  return x;
}

// Auth middleware
async function requireAuth(req, res, next) {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET);

    try {
      const activeCount = await prisma.refreshToken.count({
        where: { userId: Number(payload.sub), revoked: false },
      });
      if (activeCount === 0)
        return res.status(401).json({ error: "Logged out" });
    } catch (e) {
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
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
  school: z.string().min(1).max(50),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

// Routes --------------------------------------------------------------------------------------------

// POST /api/generate-exam

app.post(
  "/api/generate-exam",
  requireAuth,
  upload.array("files", 5),
  async (req, res) => {
    try {
      const sqlUserId = Number(req.user.id);
      const { scheduleId, eventId, title } = req.body;

      if (!scheduleId || !eventId) {
        return res
          .status(400)
          .json({ error: "scheduleId and eventId are required" });
      }

      const fileContents = [];
      for (const f of req.files || []) {
        const content = fs.readFileSync(f.path, "utf8");
        console.log(content);
        fileContents.push({ name: f.originalname, content });
      }

      const prompt = `
You are an expert exam setter for university students.
You are given either course/lecture notes or exam past papers as context
to generate relevant exam questions.

STRICTLY use this JSON schema:

export type Questions =
  | MCQQuestion
  | Question
  | CompoundQuestion
  | CompoundGroupedQuestions
  | GroupedQuestions;

export interface MCQQuestion {
  type: "mcq";
  details: {
    question: string;
    choices: string[];
    answerIndex: number;
    mark_allocation: number;
  };
}

export interface Question {
  type: "question";
  details: {
    question: string;
    model_answer?: string;
    mark_allocation: number;
  };
}

export interface CompoundQuestion {
  type: "compoundQuestion";
  details: {
    main_question: string;
    sub_questions: string[];
    model_answer?: string;
    mark_allocation: number;
  };
}

export interface CompoundGroupedQuestions {
  type: "compoundGroupedQuestions";
  details: {
    main_question?: string;
    topic?: string;
    groupedQuestions: {
      question: string;
      model_answer?: string;
      mark_allocation: number;
    }[];
  };
}

export interface GroupedQuestions {
  type: "GroupedQuestions";
  details: {
    topic: string;
    groupedQuestions: {
      question: string;
      model_answer?: string;
      mark_allocation: number;
    }[];
  };
}

Requirements:
- Follow the style, structure, and tone of the past paper closely
  (repeat some past paper questions verbatim, but not all).
- Also create new questions based on the lecture notes to make the exam comprehensive.
- Mix question types (MCQs, short-answer, compound, grouped) across the exam.
- Assign realistic mark_allocation values.
- Output must be a valid JSON array of Questions.
- Do not include any explanatory text outside the JSON.

Now generate exam questions for the following context:
${fileContents.map((f) => `File: ${f.name}\n${f.content}`).join("\n\n")}
      `;

      // Call OpenAI (no structured schema, gpt-5-nano as requested)
      const completion = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: "You are an exam generator." },
          { role: "user", content: prompt },
        ],
        temperature: 1,
      });

      let questions;
      try {
        questions = JSON.parse(completion.choices[0].message.content);
      } catch (e) {
        console.error("Failed to parse exam JSON", e);
        return res
          .status(500)
          .json({ error: "Model did not return valid JSON" });
      }

      // Save exam in Mongo
      const exam = await Exam.create({
        sqlUserId,
        scheduleId,
        eventId,
        title: title?.trim() || "Generated Exam",
        questions,
      });

      return res.status(201).json({
        examId: exam._id.toString(),
        scheduleId,
        eventId,
      });
    } catch (err) {
      console.error("[/api/generate-exam] failed:", err);
      return res.status(500).json({ error: "Failed to generate exam" });
    }
  }
);
app.post("/api/generate-schedule", requireAuth, async (req, res) => {
  try {
    const sqlUserId = Number(req.user.id);
    const { scheduleTitle, selectedModules } = req.body;
    if (!scheduleTitle || !Array.isArray(selectedModules)) {
      return res.status(400).json({ error: "Missing input data" });
    }

    // Schema for structured output
    const scheduleSchema = {
      type: "object",
      additionalProperties: false,
      properties: {
        schedules: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              timezone: { type: "string", enum: ["Africa/Johannesburg"] },
              events: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    color: {
                      type: "string",
                      enum: [
                        "blue",
                        "green",
                        "red",
                        "yellow",
                        "purple",
                        "orange",
                      ],
                    },
                    startDate: { type: "string" },
                    endDate: { type: "string" },
                  },
                  required: [
                    "title",
                    "description",
                    "color",
                    "startDate",
                    "endDate",
                  ],
                },
              },
              exams: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    color: {
                      type: "string",
                      enum: [
                        "blue",
                        "green",
                        "red",
                        "yellow",
                        "purple",
                        "orange",
                      ],
                    },
                    startDate: { type: "string" },
                    endDate: { type: "string" },
                  },
                  required: [
                    "title",
                    "description",
                    "color",
                    "startDate",
                    "endDate",
                  ],
                },
              },
            },
            required: ["title", "timezone", "events", "exams"],
          },
        },
      },
      required: ["schedules"],
    };

    // GPT call (structured JSON output)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `LLM Prompt: Exam Study Schedule Generator. You are an intelligent scheduling assistant that creates exam study schedules for students.
            1.Rules for generating study events (events): - Each module must have at least 2 and at most 5 study sessions. - Spread study sessions evenly between today’s date and2 days before the exam date. - Study sessions must not overlap in time, but can occur on the same day. - Use reasonable 2-hour blocks (e.g., 09:00–11:00, 14:00–16:00). - Assign each module a unique color from the allowed set. - Construct the title as follows: "Study:" Module Title "(Session N)" 
            2.Rules for exams (exams): - Include all exams from selectedModules. - Use the exact date and time provided in the input, converted into ISO 8601 format with timezone (+02:00). - Color must match the study events for that module. - For exams always keep the description as "Exam"
            `,
        },
        {
          role: "user",
          content: `Input:\n${JSON.stringify({
            scheduleTitle,
            selectedModules,
          })}`,
        },
      ],
      temperature: 0,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "study_schedule_schema",
          schema: scheduleSchema,
          strict: true,
        },
      },
    });

    let generated;
    try {
      const raw = completion?.choices?.[0]?.message?.content || "{}";
      generated = JSON.parse(raw);
    } catch (e) {
      throw new Error("Model returned invalid JSON");
    }
    const { Schedule } = await esm("./src/models/Schedule.js").then((m) => m);

    // Save each schedule into Mongo
    const savedSchedules = await Promise.all(
      generated.schedules.map((s) =>
        Schedule.create({
          sqlUserId,
          title: scheduleTitle,
          timezone: s.timezone,
          events: s.events,
          exams: s.exams,
        })
      )
    );

    return res.status(201).json({
      message: "Schedule generated and saved",
      schedules: savedSchedules.map((s) => ({
        id: s._id.toString(),
        title: s.title,
        timezone: s.timezone,
      })),
    });
  } catch (err) {
    console.error("[/api/generate-schedule] failed:", err);
    return res.status(500).json({ error: "Failed to generate schedule" });
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? "*",
    credentials: true,
  })
);

app.post("/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, school } =
      RegisterSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email in use" });

    const passwordHash = await argon2.hash(password);

    const user = await prisma.user.create({ data: { email, passwordHash } });
    const profileData = { firstName, lastName, phone, school };

    esm("./src/services/ensureMongoUser.js")
      .then((m) => m.ensureMongoUserProfile(user, profileData))
      .catch((e) =>
        console.warn(
          "[register] ensureMongoUserProfile failed (non-fatal)",
          e?.message || e
        )
      );

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
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
      accessToken,
      refreshToken,
    });
  } catch (e) {
    if (e?.issues) return res.status(400).json({ error: e.issues });
    console.error("[/auth/register] failed:", e?.message || e);
    return res.status(500).json({ error: "Server error" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    let ok = false;
    try {
      ok = await argon2.verify(user.passwordHash, password);
    } catch {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    esm("./src/services/ensureMongoUser.js")
      .then((m) => m.ensureMongoUserProfile(user))
      .catch((e) =>
        console.warn(
          "[login] ensureMongoUserProfile failed (non-fatal)",
          e?.message || e
        )
      );

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
    console.error("[/auth/login] failed:", e?.message || e);
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

    const dbToken = await prisma.refreshToken.findUnique({
      where: { jti: payload.jti },
    });
    if (!dbToken) return res.json({ ok: true });

    const matches = await argon2
      .verify(dbToken.tokenHash, refreshToken)
      .catch(() => false);
    if (!matches) return res.json({ ok: true });

    await prisma.refreshToken.deleteMany({
      where: { userId: dbToken.userId },
    });

    return res.json({ ok: true });
  } catch (e) {
    return res.status(401).json({ error: "Invalid/expired token" });
  }
});

app.get("/auth/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.id) },
      select: { id: true, email: true, createdAt: true },
    });
    return res.json({ user });
  } catch (e) {
    console.error("[/auth/me] failed:", e?.message || e);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /profile/me
app.get("/profile/me", requireAuth, async (req, res) => {
  const sqlUserId = Number(req.user.id);
  const { UserProfile } = await esm("./src/models/User.js").then((m) => m);
  const profile = await UserProfile.findOne({ sqlUserId }).lean();
  return res.json({ profile });
});

// PUT /profile/me
app.put("/profile/me", requireAuth, async (req, res) => {
  const sqlUserId = Number(req.user.id);
  const { firstName, lastName, phone, school, avatarUrl } = req.body || {};
  const { UserProfile } = await esm("./src/models/User.js").then((m) => m);

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
    exams = [],
  } = req.body || {};
  const { Schedule } = await esm("./src/models/Schedule.js").then((m) => m);

  const schedule = await Schedule.create({
    sqlUserId,
    title,
    timezone,
    events,
    exams,
  });
  return res.status(201).json({ scheduleId: schedule._id.toString() });
});

// GET /api/schedules
app.get("/api/schedules", requireAuth, async (req, res) => {
  try {
    const sqlUserId = Number(req.user.id);
    const { Schedule } = await esm("./src/models/Schedule.js").then((m) => m);
    const docs = await Schedule.find({ sqlUserId }).lean();

    const schedules = docs.map((s) => ({
      id: s._id.toString(),
      title: s.title,
      timezone: s.timezone || "Africa/Johannesburg",
      events: (s.events || []).map((e) => ({
        title: e.title,
        description: e.description || "",
        color: e.color,
        startDate: new Date(e.startDate).toISOString(),
        endDate: new Date(e.endDate).toISOString(),
      })),
      exams: (s.exams || []).map((e) => ({
        title: e.title,
        description: e.description || "",
        color: e.color,
        startDate: new Date(e.startDate).toISOString(),
        endDate: new Date(e.endDate).toISOString(),
      })),
    }));

    return res.json({ schedules });
  } catch (e) {
    console.error("[/api/schedules] failed:", e?.message || e);
    return res.status(500).json({ error: "Failed to fetch schedules" });
  }
});

// GET /api/schedules/:id -> { schedule }
app.get("/api/schedules/:id", requireAuth, async (req, res) => {
  try {
    const sqlUserId = Number(req.user.id);
    const { id } = req.params;
    const { Schedule } = await esm("./src/models/Schedule.js").then((m) => m);

    const s = await Schedule.findOne({ _id: id, sqlUserId }).lean();
    if (!s) return res.status(404).json({ error: "Schedule not found" });

    const schedule = {
      id: s._id.toString(),
      title: s.title,
      timezone: s.timezone || "Africa/Johannesburg",
      events: (s.events || []).map((e) => ({
        id: e._id ? e._id.toString() : undefined,
        title: e.title,
        description: e.description || "",
        color: e.color,
        startDate: new Date(e.startDate).toISOString(),
        endDate: new Date(e.endDate).toISOString(),
      })),
      exams: (s.exams || []).map((e) => ({
        id: e._id ? e._id.toString() : undefined,
        title: e.title,
        description: e.description || "",
        color: e.color,
        startDate: new Date(e.startDate).toISOString(),
        endDate: new Date(e.endDate).toISOString(),
      })),
    };

    return res.json({ schedule });
  } catch (e) {
    console.error("[/api/schedules/:id] failed:", e?.message || e);
    return res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

// GET /api/calendar/events
app.get("/api/calendar/events", requireAuth, async (req, res) => {
  const sqlUserId = Number(req.user.id);
  const { Schedule } = await esm("./src/models/Schedule.js").then((m) => m);
  const { UserProfile } = await esm("./src/models/User.js").then((m) => m);

  const [schedules, profile] = await Promise.all([
    Schedule.find({ sqlUserId }).lean(),
    UserProfile.findOne({ sqlUserId }).lean(),
  ]);

  const events = schedules.flatMap((s) => {
    const mapItem = (e) => ({
      id: e._id.toString(),
      scheduleId: s._id.toString(),
      title: e.title,
      description: e.description,
      color: e.color,
      startDate: new Date(e.startDate).toISOString(),
      endDate: new Date(e.endDate).toISOString(),
      user: profile
        ? {
            _id: profile._id.toString(),
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            avatarUrl: profile.avatarUrl,
          }
        : null,
    });
    return [
      ...(Array.isArray(s.events) ? s.events.map(mapItem) : []),
      ...(Array.isArray(s.exams) ? s.exams.map(mapItem) : []),
    ];
  });

  res.json(events);
});

app.listen(PORT, () => {
  console.log(`Auth service on http://localhost:${PORT}`);
});
