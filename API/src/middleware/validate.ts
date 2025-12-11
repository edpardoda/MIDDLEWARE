import { z, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateBody = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }));
      return res.status(400).json({
        ok: false,
        error: "VALIDATION_ERROR",
        details: errors
      });
    }
    // sobrescribir body con parsed data (puede tener coersiones)
    req.body = result.data;
    next();
  };
};
