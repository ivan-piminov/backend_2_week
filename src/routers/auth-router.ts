import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

import { HTTP_STATUSES } from '../helpers/HTTP-statuses';
import { inputValidationMiddleware } from '../auth/middleware/input-post-vaditation-middleware';
import { userService } from '../domains/user-service';
import { jwtService } from '../application/jwt-service';
import { authMiddlewareJWT } from '../auth/middleware/auth-miidleware-jwt';
import { userQueryService } from '../queryRepositories/user-query-repository';

export const authRouter = Router({});

authRouter.post(
  '/login',
  body('loginOrEmail')
    .isString().withMessage('string'),
  body('password')
    .isString().withMessage('string'),
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (user) {
      const token = await jwtService.createJWT(user);
      return res.status(HTTP_STATUSES.OK_200).send(token);
    }
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
  },
);

authRouter.get(
  '/me',
  authMiddlewareJWT,
  async (req: Request, res: Response) => {
    /* id  и юзера есть, т.к. в authMiddlewareJWT проверяется его наличие */
    const user = await userQueryService.getUserById(req.user!.id);
    return res.status(HTTP_STATUSES.OK_200).send(
      {
        login: user!.login,
        email: user!.email,
        userId: user!.id,
      },
    );
  },
);
