import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUSES } from '../../helpers/HTTP-statuses';
import { tokenService } from '../../domains/token-service';

export const authMiddlewareJWTRefresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.cookies.refreshToken) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
  }
  const { refreshToken } = req.cookies;
  const isExistToken = await tokenService.checkRefreshJWT(refreshToken);
  if (isExistToken) {
    return next();
  }
  return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
};
