import { Response, Request, NextFunction } from 'express';

import { customValidationResult } from '../../helpers/custom-validation-result';

export const inputValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // eslint-disable-next-line max-len
  const errors: Array<{ message: string, field: string }> = customValidationResult(req).array({ onlyFirstError: true });
  if (errors.length) {
    return res.status(400).send({ errorsMessages: errors });
  }
  return next();
};
