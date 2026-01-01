import { Router } from "express";

import {
  getAuthenticatedUser,
  loginUserController,
  logoutController,
  refreshController,
} from "#controllers/auth.controllers/auth.controller";
import { requireAuth } from "#middleware/requireAuth";

const router = Router();

// public
router.post("/login", loginUserController);
router.post("/refresh", refreshController);

// protected
router.post("/logout", requireAuth, logoutController);
router.post("/me", requireAuth, getAuthenticatedUser);

export default router;
