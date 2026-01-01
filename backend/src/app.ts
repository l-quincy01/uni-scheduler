import express from "express";
import cors from "cors";

import authRouter from "#routes/auth.routes/auth.routes.js";
import examsRouter from "#routes/examRoutes.js";
import schedulesRouter from "#routes/schedulesRoutes.js";
import calendarRouter from "#routes/calendarRoutes.js";
import moduleRouter from "#routes/moduleRoutes.js";
import userRouter from "#routes/user.routes/user.routes";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors({ origin: "*" }));

  app.get("/health", (_, res) => res.json({ ok: true }));

  app.use("/auth", authRouter);
  app.use("/api", userRouter);
  app.use("/api", examsRouter);
  app.use("/api", moduleRouter);
  app.use("/api", schedulesRouter);
  app.use("/api", calendarRouter);

  return app;
}
