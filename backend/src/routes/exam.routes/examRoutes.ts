import { Router, Request, Response } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { Exam } from "../../models/Exam";
import { Schedule } from "../../models/Schedule";
import { upload } from "../../utils/fileUpload";
import {
  createUserExam,
  getUserExamByID,
  getUserExamsByForeignKey,
  getUserExamBySchedule,
} from "#controllers/exam.controller/exam.controllers";

const router = Router();

/*
 CREATE =============================================================================
*/
/**
 * POST /api/generate-exam
 */
router.post("/exam", requireAuth, upload.array("files", 5), createUserExam);

/*
 READ =============================================================================
*/

/**
 * GET /api/exams
 */
router.get("/exam/:id", requireAuth, getUserExamByID);

/**
 * GET /api/exams/:id
 */
router.get("/exam/by-key/:examKey", requireAuth, getUserExamsByForeignKey);

/**
 * GET /api/schedules/:id/exams
 *  getExamsForSchedule
 */
router.get("/exams", requireAuth, getUserExamBySchedule);

export default router;
