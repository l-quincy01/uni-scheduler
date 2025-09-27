import express from "express";
import authRouter from "./auth/auth.ts";
import examsRouter from "./routes/examRoutes.ts";
import schedulesRouter from "./routes/schedules.ts";
import cors from "cors";
import "dotenv/config";

const app = express();
const { PORT, CORS_ORIGIN = "*", NODE_ENV = "development" } = process.env;

// Connect Mongo
import("./db/mongo.ts")
  .then((m) => m.connectMongo())
  .catch((err) => {
    console.error("[mongo] failed to connect:", err);
  });

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/health", (req, res) => res.json({ ok: true }));

// Mount routes
app.use("/auth", authRouter);
app.use("/api", examsRouter);
app.use("/api", schedulesRouter);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
