import { Router, Request, Response } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { Schedule } from "../../models/Schedule";
import { UserProfile } from "../../models/User";
import { getCalendarEvents } from "#controllers/calendar.controllers/calendar.controller";

const router = Router();

/**
 * GET /api/calendar/events
 */
router.get("/calendar", requireAuth, getCalendarEvents);

export default router;
