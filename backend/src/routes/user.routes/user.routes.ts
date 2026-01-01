import { Router } from "express";

import { requireAuth } from "#middleware/requireAuth";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "#controllers/user.controllers/user.controller";

const router = Router();

router.post("/users", createUser);
router.get("/users/:id", requireAuth, getUser);
router.patch("/users/:id", requireAuth, updateUser);
router.delete("/users/:id", requireAuth, deleteUser);

export default router;
