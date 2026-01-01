import { Request, Response } from "express";
import { LoginSchema } from "#validations/auth.validation.js";
import {
  loginUserService,
  logout,
  refreshAccessToken,
} from "#services/auth.service/auth.service.js";
import { AuthenticatedRequest } from "#middleware/requireAuth.js";

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
