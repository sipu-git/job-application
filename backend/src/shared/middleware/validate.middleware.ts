import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

interface ValidationSchemas {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
}

export const validate =
  (schemas: ValidationSchemas) =>
  (req: Request, res: Response, next: NextFunction) => {
    const errors: any = {};

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.body = result.error.flatten();
      } else {
        req.body = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.query = result.error.flatten();
      } else {
        req.query = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.params = result.error.flatten();
      } else {
        req.params = result.data;
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };