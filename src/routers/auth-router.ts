import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

import { HTTP_STATUSES } from '../helpers/HTTP-statuses';
import { inputValidationMiddleware } from '../auth/middleware/input-post-vaditation-middleware';
import { userService } from '../domains/user-service';

export const authRouter = Router({});

authRouter.post(
  '/login',
  body('loginOrEmail')
    .isString().withMessage('string'),
  body('password')
    .isString().withMessage('string'),
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const checkResult = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (checkResult) {
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
  },
);
