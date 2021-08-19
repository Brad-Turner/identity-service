import type { RequestHandler } from 'express';

export function removeHeaders(): RequestHandler {
  return (req, res, next) => {
    res.removeHeader('x-powered-by');
    next();
  };
}
