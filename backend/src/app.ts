import express from "express";
import cors from "cors";

import authRouter from "#auth/auth.routes/auth.routes.js";
import examsRouter from "#routes/examRoutes.js";
import schedulesRouter from "#routes/schedulesRoutes.js";
import calendarRouter from "#routes/calendarRoutes.js";
import moduleRouter from "#routes/moduleRoutes.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors({ origin: "*" }));

  app.get("/health", (_, res) => res.json({ ok: true }));

  app.use("/auth", authRouter);
  app.use("/api", examsRouter);
  app.use("/api", moduleRouter);
  app.use("/api", schedulesRouter);
  app.use("/api", calendarRouter);

  return app;
}
