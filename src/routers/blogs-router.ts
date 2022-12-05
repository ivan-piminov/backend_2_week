import {Request, Response, Router} from "express";
import {authMiddleware} from "../auth/middleware/auth-middliware";
import {HTTP_STATUSES} from "../helpers/HTTP-statuses";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../auth/middleware/input-post-vaditation-middleware";
import {blogsService} from "../domains/blogs-service";
import {blogsQueryRepository} from "../queryRepositories/blog-query-repository";
import {PostType} from "../repositories/post-repository-db";

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    const blogs = await blogsQueryRepository.getBlogs(
        req.query.pageNumber as string,
        req.query.pageSize as string,
        req.query.sortBy as string,
        req.query.sortDirection as string,
    )
    res.status(HTTP_STATUSES.OK_200).send(blogs)
})
blogsRouter.get('/:blogId/posts', async (req: Request, res: Response) => {
    const posts = await blogsQueryRepository.getPostsFromBlog(
        req.query.pageNumber as string,
        req.query.pageSize as string,
        req.query.sortBy as string,
        req.query.sortDirection as string,
        req.params.blogId
    )
    if (posts) {
        return res.status(HTTP_STATUSES.OK_200).send(posts)
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await blogsQueryRepository.getBlog(req.params.id)
    if (blog) {
        return res.status(HTTP_STATUSES.OK_200).send(blog)
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
blogsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const isDeleted = await blogsService.deleteBlog(req.params.id)
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
        const newBlog = await blogsService.addBlog(
            req.body.name,
            req.body.description,
            req.body.websiteUrl
        )
        return res.status(HTTP_STATUSES.CREATED_201).send(newBlog)
    })
blogsRouter.post(
    '/:blogId/posts',
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
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newPost: PostType | null = await blogsService.addPostOnExistBlog(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.params.blogId
        )
        if (newPost) {
            return res.status(HTTP_STATUSES.CREATED_201).send(newPost)
        }
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })
blogsRouter.put(
    '/:id',
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
        const isUpdated = await blogsService.updateBlog(name, description, websiteUrl, id)
        if (isUpdated) {
            return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })
