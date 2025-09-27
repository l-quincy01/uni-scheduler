import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

const { JWT_ACCESS_SECRET = "access_secret" } = process.env;

export interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET) as {
      sub: number;
      email: string;
    };

    try {
      const activeCount = await prisma.refreshToken.count({
        where: { userId: Number(payload.sub), revoked: false },
      });

      if (activeCount === 0) {
        return res.status(401).json({ error: "Logged out" });
      }
    } catch {
      return res.status(401).json({ error: "Auth check failed" });
    }

    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid/expired token" });
  }
}

export default { requireAuth };
