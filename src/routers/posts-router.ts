import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../helpers/HTTP-statuses";
import {authMiddleware} from "../auth/middleware/auth-middliware";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../auth/middleware/input-post-vaditation-middleware";
import {blogs} from "../repositories/blogs-repository";
import {postRepository} from "../repositories/post-repository-db";
import {blogsCollection} from "../repositories/db";
// import {postRepository} from "../repositories/post-repository";

export const postsRouter = Router({})


postsRouter.get('/', async (req: Request, res: Response) => {
    const posts = await postRepository.getPosts()
    res.status(HTTP_STATUSES.OK_200).send(posts)
})
postsRouter.get('/:id', async (req: Request, res: Response) => {
    const post = await postRepository.getPost(req.params.id)
    if (post) {
        res.status(HTTP_STATUSES.OK_200).send(post)
    }
    /* не обработан кейс Bad Request см доку */
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
postsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    if (await postRepository.deletePost(req.params.id)) {
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
        .custom(async ({}, {req}) => {
            /* обращение из бд при валидации? так можно/нужно? */
            const blog = await blogsCollection.findOne({id: req.body.blogId})
            if (!blog) {
                throw new Error('incorrect BlogID');
            }
            return true
        }),
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        const newPost = await postRepository.addPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId
        )
        if (newPost) {
            return res.status(HTTP_STATUSES.CREATED_201).send(newPost)

        }
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
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
        .custom(async ({}, {req}) => {
            /* обращение из бд при валидации? так можно/нужно? */
            const blog = await blogsCollection.findOne({id: req.body.blogId})
            if (!blog) {
                throw new Error('incorrect BlogID');
            }
            return true
        }),
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        let post = await postRepository.updatePost(
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
