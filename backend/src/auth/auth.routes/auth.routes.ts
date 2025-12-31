import { Router, Request, Response } from "express";
import { LoginSchema, RegisterSchema } from "#validations/auth.validation.js";
import {
  loginUserService,
  registerUserService,
} from "#auth/auth.service/auth.service.js";
import {
  createUser,
  deleteUser,
  getAuthenticatedUser,
  getUser,
  loginUserController,
  logoutController,
  refreshController,
  registerUserController,
  updateUser,
  userProfile,
} from "#auth/auth.controllers/auth.controller";
import { requireAuth } from "#middleware/requireAuth";

const router = Router();

// public
router.post("/login", loginUserController);
router.post("/refresh", refreshController);

// protected
router.post("/logout", requireAuth, logoutController);
router.post("/me", requireAuth, getAuthenticatedUser);

router.post("/users", createUser);
router.get("/users/:id", requireAuth, getUser);
router.patch("/users/:id", requireAuth, updateUser);
router.delete("/users/:id", requireAuth, deleteUser);

export default router;
