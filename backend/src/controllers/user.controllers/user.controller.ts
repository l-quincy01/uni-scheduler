import { Request, Response } from "express";
import {
  RegisterSchema,
  UpdateUserSchema,
} from "#validations/auth.validation.js";
import {
  deleteUserService,
  getUserService,
  registerUserService,
  updateUserService,
} from "#services/auth.service/auth.service.js";
import { AuthenticatedRequest } from "#middleware/requireAuth.js";

export const createUser = async (req: Request, res: Response) => {
  try {
    const payload = RegisterSchema.parse(req.body);

    const result = await registerUserService(payload);

    return res.status(201).json(result);
  } catch (err: any) {
    if (err?.message === "EMAIL_IN_USE") {
      return res.status(409).json({ error: "Email already in use" });
    }

    if (err?.issues) {
      return res.status(400).json({ error: err.issues });
    }

    return res.status(500).json({ error: "Server error" });
  }
};

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const profile = await getUserService(req.user.id);

    return res.json({ profile });
  } catch (err: any) {
    if (err?.message === "USER_NOT_FOUND") {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = UpdateUserSchema.parse(req.body);
    const profile = await updateUserService(req.user.id, payload);

    return res.json({ profile });
  } catch (err: any) {
    if (err?.message === "EMAIL_IN_USE") {
      return res.status(409).json({ error: "Email already in use" });
    }
    if (err?.message === "USER_NOT_FOUND") {
      return res.status(404).json({ error: "User not found" });
    }

    if (err?.issues) {
      return res.status(400).json({ error: err.issues });
    }

    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await deleteUserService(req.user.id);
    return res.json({ success: true });
  } catch (err: any) {
    if (err?.message === "USER_NOT_FOUND") {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(500).json({ error: "Server error" });
  }
};
