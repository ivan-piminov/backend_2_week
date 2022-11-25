import {Request, Response, Router} from "express";
import {authMiddleware} from "../auth/middleware/auth-middliware";
import {HTTP_STATUSES} from "../helpers/HTTP-statuses";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../auth/middleware/input-post-vaditation-middleware";
import {blogsRepository} from "../repositories/blogs-repository";

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    const blogs = await blogsRepository.getBlogs()
    res.status(HTTP_STATUSES.OK_200).send(blogs)
})
blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await blogsRepository.getBlog(req.params.id)
    if (blog) {
        return res.status(HTTP_STATUSES.OK_200).send(blog)
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
blogsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const isDeleted = await blogsRepository.deleteBlog(req.params.id)
    if (isDeleted) {
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

})
blogsRouter.post(
    '/',
    authMiddleware,
    /* вынести валидацию - одинаковая в post и update */
    body('name')
        .isString().withMessage('should be string')
        .trim()
        .isLength({min: 1, max: 15}).withMessage('min 1, max 15 symbols'),
    body('description')
        .isString().withMessage('should be string')
        .trim()
        .isLength({min: 1, max: 500}).withMessage('min 1, max 500 symbols'),
    body('websiteUrl')
        .isString().withMessage('should be string')
        .trim()
        .isLength({min: 1, max: 100}).withMessage('min 1, max 500 symbols')
        .custom(({}, {req}) => {
            if (!/https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(req.body.websiteUrl)) {
                throw new Error('incorrect url');
            }
            return true
        }),
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newBlog = await blogsRepository.addPost(
            req.body.name,
            req.body.description,
            req.body.websiteUrl,
            new Date().toISOString()
        )
        res.status(HTTP_STATUSES.CREATED_201).send(newBlog)
    })
blogsRouter.put(
    '/:id',
    authMiddleware,
    authMiddleware,
    body('name')
        .isString().withMessage('should be string')
        .trim()
        .isLength({min: 1, max: 15}).withMessage('min 1, max 15 symbols'),
    body('description')
        .isString().withMessage('should be string')
        .isLength({min: 1, max: 500}).withMessage('min 1, max 500 symbols'),
    body('websiteUrl')
        .isString().withMessage('should be string')
        .isLength({min: 1, max: 100}).withMessage('min 1, max 500 symbols')
        .custom(({}, {req}) => {
            if (!/https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(req.body.websiteUrl)) {
                throw new Error('incorrect url');
            }
            return true
        })
    ,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const {id} = req.params
        const {name, description, websiteUrl} = req.body
        const isUpdated = await blogsRepository.updatePost(name, description, websiteUrl, id)
        if (isUpdated) {
            return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })
