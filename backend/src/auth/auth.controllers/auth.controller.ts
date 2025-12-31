import { Request, Response } from "express";
import {
  LoginSchema,
  RegisterSchema,
  UpdateUserSchema,
} from "#validations/auth.validation.js";
import {
  deleteUserService,
  getUserService,
  loginUserService,
  logout,
  refreshAccessToken,
  registerUserService,
  updateUserService,
} from "#auth/auth.service/auth.service.js";
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

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const payload = LoginSchema.parse(req.body);

    const result = await loginUserService({
      email: payload.email,
      password: payload.password,
      ip: req.ip,
      userAgent: req.headers["user-agent"] || null,
    });

    return res.json(result);
  } catch (err: any) {
    if (err?.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (err?.issues) {
      return res.status(400).json({ error: err.issues });
    }

    return res.status(500).json({ error: "Server error" });
  }
};

export async function getAuthenticatedUser(req: Request, res: Response) {
  const { user } = req as AuthenticatedRequest;
  if (!user) {
    return res.status(500).json({ error: "User missing from request context" });
  }

  return res.json({ user });
}

export async function refreshController(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    const result = await refreshAccessToken(refreshToken);

    return res.json(result);
  } catch (err: any) {
    switch (err?.message) {
      case "MISSING_TOKEN":
        return res.status(400).json({ error: "Missing token" });
      case "INVALID_TOKEN":
      case "UNKNOWN_USER":
      default:
        return res.status(401).json({ error: "Invalid/expired token" });
    }
  }
}

export async function logoutController(req: Request, res: Response) {
  const { refreshToken } = req.body;

  await logout(refreshToken);

  return res.json({ ok: true });
}
