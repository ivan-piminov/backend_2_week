import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

import jwt from 'jsonwebtoken';
import { HTTP_STATUSES } from '../helpers/HTTP-statuses';
import { inputValidationMiddleware } from '../auth/middleware/input-post-vaditation-middleware';
import { userService } from '../domains/user-service';
import { jwtService } from '../application/jwt-service';
import { authMiddlewareJWTAccess } from '../auth/middleware/auth-miidleware-jwt-access';
import { userQueryRepository } from '../queryRepositories/user-query-repository';
import { usersCollection } from '../repositories/db';
import { authMiddlewareJWTRefresh } from '../auth/middleware/auth-miidleware-jwt-refresh';
import { tokenRepository } from '../repositories/token-repository-db';
import { tokenService } from '../domains/token-service';
import { settings } from '../settings';

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
    if (typeof user !== 'boolean') {
      const { refreshToken, accessToken } = await jwtService.createJWT(user.accountData.id);
      await tokenService.saveRefreshJWT(refreshToken, user.accountData.id);
      res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 20, secure: true });
      return res.status(HTTP_STATUSES.OK_200).send({ accessToken });
    }
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
  },
);
authRouter.post(
  '/logout',
  async (req: Request, res: Response) => {
    if (!req.body) {
      return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }

    const { refreshToken } = req.cookies;
    res.clearCookie('refreshToken');
    const refreshTokenFromDb = await tokenService.findUserByToken(refreshToken);
    if (refreshTokenFromDb) {
      await tokenService.deleteTokenInfo(refreshToken);
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
  },
);
authRouter.post(
  '/refresh-token',
  authMiddlewareJWTRefresh,
  async (req: Request, res: Response) => {
    if (!req.body) {
      return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
    const { refreshToken } = req.cookies;
    const userData = await tokenService.checkRefreshJWT(refreshToken);
    if (typeof userData !== 'boolean') {
      // eslint-disable-next-line consistent-return
      jwt.verify(userData.token, `${settings.JWT_SECRET_REFRESH}`, (err) => {
        if (err) {
          return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }
      });
      const { refreshToken: newRefreshToken, accessToken } = await jwtService.createJWT(userData.userId);
      await tokenRepository.updateRefreshToken(userData.userId, newRefreshToken);
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 20, secure: true });
      return res.status(HTTP_STATUSES.OK_200).send({ accessToken });
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
  authMiddlewareJWTAccess,
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
