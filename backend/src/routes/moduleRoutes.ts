import { Request, Response, Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { Module } from "../models/Module";
import { getUserModules } from "../services/services.modules/modules.service";

const router = Router();

/**
 * GET /api/modules
 *  modules grouped by category
 */
router.get("/modules", requireAuth, getUserModules);

export default router;
