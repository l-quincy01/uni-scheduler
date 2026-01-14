import { Router } from "express";

import { requireAuth } from "#middleware/requireAuth";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "#controllers/user.controllers/user.controller";

const router = Router();

/*
 CREATE =============================================================================
*/
/**
 * POST /api/users
 */
router.post("/users", createUser);

/*
 READ =============================================================================
*/
/**
 * GET /api/users/{id}
 */
router.get("/users/:id", requireAuth, getUser);

/*
 UPDATE =============================================================================
*/
/**
 * PATCH /api/users/{id}
 */
router.patch("/users/:id", requireAuth, updateUser);

/*
 DELETE =============================================================================
*/
/**
 * DELETE /api/users/{id}
 */
router.delete("/users/:id", requireAuth, deleteUser);

export default router;
