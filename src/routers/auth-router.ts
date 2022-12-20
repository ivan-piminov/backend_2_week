import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

import { HTTP_STATUSES } from '../helpers/HTTP-statuses';
import { inputValidationMiddleware } from '../auth/middleware/input-post-vaditation-middleware';
import { userService } from '../domains/user-service';
import { jwtService } from '../application/jwt-service';
import { authMiddlewareJWT } from '../auth/middleware/auth-miidleware-jwt';
import { userQueryRepository } from '../queryRepositories/user-query-repository';
import { usersCollection } from '../repositories/db';

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
      return res.status(HTTP_STATUSES.OK_200).send({ accessToken: token });
    }
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
  },
);

authRouter.post(
  '/registration',
  body('login')
    .isString().withMessage('should be string')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('min 3, max 10 symbols')
    .custom(async ({}, { req }) => {
      const user = await usersCollection.findOne({ 'accountData.login': req.body.login });
      if (user) {
        throw new Error('login is already exist');
      }
      if (!/^[a-zA-Z0-9_-]*$/.test(req.body.login)) {
        throw new Error('incorrect login');
      }
      return true;
    }),
  body('password')
    .isString().withMessage('should be string')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('min 6, max 20 symbols'),
  body('email')
    .isString().withMessage('should be string')
    .custom(async ({}, { req }) => {
      const user = await usersCollection.findOne({ 'accountData.email': req.body.email });
      if (user) {
        throw new Error('email is already exist');
      }
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.email)) {
        throw new Error('incorrect email');
      }
      return true;
    }),
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newUser = await userService.addUser(
      req.body.login,
      req.body.password,
      req.body.email,
    );
    if (newUser) {
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  },
);
authRouter.post(
  '/registration-confirmation',
  body('code')
    .isString().withMessage('should be string')
    .trim()
    .custom(async ({}, { req }) => {
      const res = await userService.confirmEmail(req.body.code);
      if (!res) {
        throw new Error('Something wrong');
      }
      return true;
    }),
  inputValidationMiddleware,
  (req: Request, res: Response) => res.sendStatus(HTTP_STATUSES.NO_CONTENT_204),
);

authRouter.post(
  '/registration-email-resending',
  body('email')
    .isString().withMessage('should be string')
    .custom(async ({}, { req }) => {
      const user = await userQueryRepository.findUserByEmail(req.body.email);
      if (!user || user.emailConfirmations.isConfirmed) {
        throw new Error('something wrong with email');
      }
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.email)) {
        throw new Error('incorrect email');
      }
      return true;
    }),
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const result = await userService.resendEmail(req.body.email);
    if (result) {
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  },
);
authRouter.get(
  '/me',
  authMiddlewareJWT,
  async (req: Request, res: Response) => {
    /* id  и юзера есть, т.к. в authMiddlewareJWT проверяется его наличие */
    const user = await userQueryRepository.getUserById(req.user!.accountData.id);
    return res.status(HTTP_STATUSES.OK_200).send(
      {
        login: user!.accountData.login,
        email: user!.accountData.email,
        userId: user!.accountData.id,
      },
    );
  },
);
