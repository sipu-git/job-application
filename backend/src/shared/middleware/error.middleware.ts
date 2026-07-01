import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod";
import { AppError } from "../lib/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("ERROR:", err);
 
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    })
  }

  // Prisma known errors (P2002, P2025, etc.)
  if (err.code && err.code.startsWith("P")) {
    return res.status(400).json({
      success: false,
      message: "Database operation failed"
    })
  }

  // Unknown / fallback error
  return res.status(500).json({
    success: false,
    message: "Internal server error"
  })
}