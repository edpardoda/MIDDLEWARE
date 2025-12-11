import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public error: string = 'SERVER_ERROR'
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[ERROR]', err);

  if (res.headersSent) return next(err);

  // AppError personalizado
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ok: false,
      error: err.error,
      message: err.message
    });
  }

  // Zod errors (fallback)
  if (err instanceof ZodError) {
    const errors = err.issues.map(e => ({
      path: e.path.join('.'),
      message: e.message
    }));
    return res.status(400).json({
      ok: false,
      error: 'VALIDATION_ERROR',
      details: errors
    });
  }

  // Error genérico
  res.status(500).json({
    ok: false,
    error: 'SERVER_ERROR',
    message: 'Error interno del servidor'
  });
}
