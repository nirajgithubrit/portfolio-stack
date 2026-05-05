import type { Request, Response, NextFunction, RequestHandler } from 'express';

/** Ensures rejected async route handlers reach Express error middleware. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler {
  return (req, res, next) => {
    void fn(req, res, next).catch(next);
  };
}
