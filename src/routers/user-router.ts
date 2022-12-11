import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

import { HTTP_STATUSES } from '../helpers/HTTP-statuses';
import { userQueryService } from '../queryRepositories/user-query-repository';
import { authMiddleware } from '../auth/middleware/auth-middliware';
import { inputValidationMiddleware } from '../auth/middleware/input-post-vaditation-middleware';
import { userService } from '../domains/user-service';

export const usersRouter = Router({});

usersRouter.get('/', async (req: Request, res: Response) => {
  const users = await userQueryService.getUsers(
        req.query.pageNumber as string,
        req.query.pageSize as string,
        req.query.sortBy as string,
        req.query.sortDirection as string,
        req.query.searchLoginTerm as string | null,
        req.query.searchEmailTerm as string | null,
  );
  return res.status(HTTP_STATUSES.OK_200).send(users);
});
usersRouter.post(
  '/',
  authMiddleware,
  body('login')
    .isString().withMessage('should be string')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('min 3, max 10 symbols')
    .custom(({}, { req }) => {
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
    .custom(({}, { req }) => {
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
    return res.status(HTTP_STATUSES.CREATED_201).send(newUser);
  },
);
usersRouter.delete(
  '/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    if (await userService.deleteUser(req.params.id)) {
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  },
);
