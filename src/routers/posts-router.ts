import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../helpers/HTTP-statuses";
import {authMiddleware} from "../auth/middleware/auth-middliware";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../auth/middleware/input-post-vaditation-middleware";
import {blogs} from "../repositories/blogs-repository";
import {postRepository} from "../repositories/post-repository";

export const postsRouter = Router({})


postsRouter.get('/', (req: Request, res: Response) => {
    res.status(HTTP_STATUSES.OK_200).send(postRepository.getPosts())
})
postsRouter.get('/:id', (req: Request, res: Response) => {
    const post = postRepository.getPost(req.params.id)
    if (post) {
        res.status(HTTP_STATUSES.OK_200).send(post)
    }
    /* не обработан кейс Bad Request см доку */
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
postsRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
    const posts = postRepository.deletePost(req.params.id)
    if (posts) {
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
postsRouter.post(
    '/',
    authMiddleware,
    body('title')
        .isString().withMessage('should be string')
        .trim()
        .isLength({min: 1, max: 30}).withMessage('min 1, max 30 symbols'),
    body('shortDescription')
        .isString().withMessage('should be string')
        .trim()
        .isLength({min: 1, max: 100}).withMessage('min 1, max 100 symbols'),
    body('content')
        .isString().withMessage('should be string')
        .trim()
        .isLength({min: 1, max: 1000}).withMessage('min 1, max 1000 symbols'),
    body('blogId')
        .isString().withMessage('should be string')
        .trim()
        .custom(({}, {req}) => {
            const blogIdArr = blogs.map((blog) => blog.id)
            if (!blogIdArr.find((id) => id === req.body.blogId)) {
                throw new Error('incorrect BlogID');
            }
            return true
        }),
    inputValidationMiddleware,
    (req: Request, res: Response) => {
        const newPost = postRepository.addPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId
        )
        res.status(HTTP_STATUSES.CREATED_201).send(newPost)

    })
postsRouter.put(
    '/:id',
    authMiddleware,
    body('title')
        .isString().withMessage('should be string')
        .trim()
        .isLength({min: 1, max: 30}).withMessage('min 1, max 30 symbols'),
    body('shortDescription')
        .isString().withMessage('should be string')
        .trim()
        .isLength({min: 1, max: 100}).withMessage('min 1, max 100 symbols'),
    body('content')
        .isString().withMessage('should be string')
        .trim()
        .isLength({min: 1, max: 1000}).withMessage('min 1, max 1000 symbols'),
    body('blogId')
        .isString().withMessage('should be string')
        .trim()
        .custom(({}, {req}) => {
            const blogIdArr = blogs.map((blog) => blog.id)
            if (!blogIdArr.find((id) => id === req.body.blogId)) {
                throw new Error('incorrect BlogID');
            }
            return true
        }),
    inputValidationMiddleware,
    (req: Request, res: Response) => {
        let post = postRepository.updatePost(
            req.params.id,
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId
        )
        if (post) {
            return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })
