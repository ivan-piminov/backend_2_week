import {
  Request,
  Response,
  Router,
} from 'express';
import { body } from 'express-validator';

import { HTTP_STATUSES } from '../helpers/HTTP-statuses';
import { authMiddleware } from '../auth/middleware/auth-middliware';
import { inputValidationMiddleware } from '../auth/middleware/input-post-vaditation-middleware';
import { postService } from '../domains/posts-service';
import { blogsCollection } from '../repositories/db';
import { postQueryRepository } from '../queryRepositories/post-query-repository';
import { PostType } from '../repositories/post-repository-db';
import { authMiddlewareJWT } from '../auth/middleware/auth-miidleware-jwt';

export const postsRouter = Router({});

postsRouter.get('/', async (req: Request, res: Response) => {
  const posts = await postQueryRepository.getPosts(
        req.query.pageNumber as string,
        req.query.pageSize as string,
        req.query.sortBy as string,
        req.query.sortDirection as string,
  );
  return res.status(HTTP_STATUSES.OK_200).send(posts);
});
postsRouter.get('/:id', async (req: Request, res: Response) => {
  const post = await postQueryRepository.getPost(req.params.id);
  if (post) {
    return res.status(HTTP_STATUSES.OK_200).send(post);
  }
  /* не обработан кейс Bad Request см доку */
  return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});
postsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  if (await postService.deletePost(req.params.id)) {
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
  return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});
postsRouter.post(
  '/',
  authMiddleware,
  body('title')
    .isString().withMessage('should be string')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('min 1, max 30 symbols'),
  body('shortDescription')
    .isString().withMessage('should be string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('min 1, max 100 symbols'),
  body('content')
    .isString().withMessage('should be string')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('min 1, max 1000 symbols'),
  body('blogId')
    .isString().withMessage('should be string')
    .trim()
    .custom(async ({}, { req }) => {
      /* обращение из бд при валидации? так можно/нужно? */
      const blog = await blogsCollection.findOne({ id: req.body.blogId });
      if (!blog) {
        throw new Error('incorrect BlogID');
      }
      return true;
    }),
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newPost: PostType | null = await postService.addPost(
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      req.body.blogId,
    );
    return res.status(HTTP_STATUSES.CREATED_201).send(newPost);
  },
);
postsRouter.put(
  '/:id',
  authMiddleware,
  body('title')
    .isString().withMessage('should be string')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('min 1, max 30 symbols'),
  body('shortDescription')
    .isString().withMessage('should be string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('min 1, max 100 symbols'),
  body('content')
    .isString().withMessage('should be string')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('min 1, max 1000 symbols'),
  body('blogId')
    .isString().withMessage('should be string')
    .trim()
    .custom(async ({}, { req }) => {
      /* обращение из бд при валидации? так можно/нужно? */
      const blog = await blogsCollection.findOne({ id: req.body.blogId });
      if (!blog) {
        throw new Error('incorrect BlogID');
      }
      return true;
    }),
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const post: boolean | null = await postService.updatePost(
      req.params.id,
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      req.body.blogId,
    );
    if (post) {
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  },
);
/* добавление коммента */
postsRouter.post(
  '/:postId/comments',
  authMiddlewareJWT,
  body('content')
    .isString().withMessage('should be string')
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage('min 20, max 300 symbols'),
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newComment = await postService.addComment(
      req.body.content,
      req.params.postId,
      /* id и логин точно есть, т.к. наличие юзера проверяется в authMiddlewareJWT */
      req.user!.accountData.id,
      req.user!.accountData.login,
    );
    if (newComment) {
      return res.status(HTTP_STATUSES.CREATED_201).send(newComment);
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  },
);
/* получение коммента */
postsRouter.get(
  '/:postId/comments',
  async (req: Request, res: Response) => {
    const posts = await postQueryRepository.getComments(
          req.params.postId as string,
          req.query.pageNumber as string,
          req.query.pageSize as string,
          req.query.sortBy as string,
          req.query.sortDirection as string,
    );
    if (posts) {
      return res.status(HTTP_STATUSES.OK_200).send(posts);
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  },
);
