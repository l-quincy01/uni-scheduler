import { Router, Request, Response } from "express";
import { requireAuth } from "#middleware/requireAuth";
import { Schedule } from "#models/Schedule";
import { UserProfile } from "#models/User";
import { generateSchedule } from "#services/llm.service/openaiClient";
import {
  createUserSchedule,
  generateUserSchedule,
  getUserSchedule,
  getUserScheduleById,
} from "#services/schedule.service/schedule.service";

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
