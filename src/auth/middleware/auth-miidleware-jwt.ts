import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUSES } from '../../helpers/HTTP-statuses';
import { jwtService } from '../../application/jwt-service';
import { userQueryService } from '../../queryRepositories/user-query-repository';

export const authMiddlewareJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
  }
  const token = req.headers.authorization.split(' ')[1];
  const userId = await jwtService.getUSerIdByToken(token);
  if (userId) {
    req.user = await userQueryService.getUserById(userId);
    return next();
  }
  return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
};
