import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { Schedule } from "../models/Schedule";
import { UserProfile } from "../models/User";
import { generateSchedule } from "../services/services.llm/openaiClient";
import {
  createUserSchedule,
  generateUserSchedule,
  getUserSchedule,
  getUserScheduleById,
} from "../services/services.schedule/schedule.service";

const router = Router();

/*
 CREATE =============================================================================
*/

/**
 * POST /api/schedules
 */
router.post("/schedules", requireAuth, createUserSchedule);

/**
 * POST /api/generate-schedule
 */
router.post("/schedules/generate", requireAuth, generateUserSchedule);

/*
 READ =============================================================================
*/

/**
 * GET /api/schedules
 */
router.get("/schedules", requireAuth, getUserSchedule);

/**
 * GET /api/schedules/:id
 */
router.get("/schedules/:id", requireAuth, getUserScheduleById);

/*
 UPDATE =============================================================================
*/
/*
 DELETE =============================================================================
*/

export default router;
