import { ErrorRequestHandler } from 'express';

import { UserError } from '../errors';

export function handleErrors(): ErrorRequestHandler {
  return (err, req, res, next) => {
    if (err instanceof UserError) {
      return res.status(err.statusCode).send({ message: err.message });
    }

    req.log.warn(err, 'Unhandled error');

    next(err);
  };
}
