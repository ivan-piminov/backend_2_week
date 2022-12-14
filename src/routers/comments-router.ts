import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

import { commentsQueryRepository } from '../queryRepositories/comments-query-repository';
import { HTTP_STATUSES } from '../helpers/HTTP-statuses';
import { authMiddlewareJWT } from '../auth/middleware/auth-miidleware-jwt';
import { commentsService } from '../domains/comment-service';
import { inputValidationMiddleware } from '../auth/middleware/input-post-vaditation-middleware';

export const commentsRouter = Router({});

commentsRouter.get(
  '/:id',
  async (req: Request, res: Response) => {
    const comment = await commentsQueryRepository.getComment(req.params.id);
    if (comment) {
      return res.status(HTTP_STATUSES.OK_200).send(comment);
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  },
);
commentsRouter.delete(
  '/:commentId',
  authMiddlewareJWT,
  async (req: Request, res: Response) => {
    const result = await commentsService.deleteComment(req.params.commentId, req.user!.id);
    if (result === 1) {
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
    if (result) {
      return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  },
);
commentsRouter.put(
  '/:commentId',
  body('content')
    .isString().withMessage('should be string')
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage('min 20, max 300 symbols'),
  inputValidationMiddleware,
  authMiddlewareJWT,
  async (req: Request, res: Response) => {
    const result = await commentsService.updateComment(
      req.params.commentId,
      req.user!.id,
      req.body.content,
    );
    if (result === 1) {
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
    if (result) {
      return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  },
);
