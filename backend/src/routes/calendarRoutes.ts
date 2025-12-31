import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { Schedule } from "../models/Schedule";
import { UserProfile } from "../models/User";
import { getCalendarEvents } from "../services/services.calendar/calendar.service";

const router = Router();

/**
 * GET /api/calendar/events
 */
router.get("/calendar", requireAuth, getCalendarEvents);

export default router;
