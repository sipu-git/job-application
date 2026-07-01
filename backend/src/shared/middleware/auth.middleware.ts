import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserRole } from "../../../generated/prisma/enums";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (req.cookies?.access_token) {
    token = req.cookies.access_token;
  }

  else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload & { id: string; role: string };

    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = decoded as JwtPayload & { id: string; role: UserRole };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};