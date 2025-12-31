import jwt from "jsonwebtoken";

export function signAccessToken(user: { id: number; email: string }) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_TTL }
  );
}

export function signRefreshToken(userId: number, jti: string) {
  return jwt.sign({ sub: userId, jti }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: `${process.env.REFRESH_TOKEN_TTL_DAYS}d`,
  });
}
