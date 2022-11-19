import {Request, Response, Router} from "express";
import {authMiddleware} from "../uath/middleware/auth-middliware";
import {HTTP_STATUSES} from "../index";
import {body, validationResult} from "express-validator";
import {customValidationResult} from "../helpers/custom-validation-result";
import {inputValidationMiddleware} from "../uath/middleware/input-post-vaditation-middleware";

export let blogs = [
    {
        id: "1",
        name: "hello",
        description: 'fgggggg',
        websiteUrl: "aaaa.ru"
    },
    {
        id: "2",
        name: "hi33",
        description: 'ttttt',
        websiteUrl: "bbbb.ru"
    },
    {
        id: "3",
        name: "welcome",
        description: '898989',
        websiteUrl: "ccc.ru"
    }

]
export const deletedBlogsData = () => blogs = []
type BlogType = {
    name: string,
    description: string,
    websiteUrl: string,
    id: string
}
export const blogsRouter = Router({})

blogsRouter.get('/', (req: Request, res: Response) => {
    res.status(HTTP_STATUSES.OK_200).send(blogs)
})
blogsRouter.get('/:id', (req: Request, res: Response) => {
    const blog = blogs.find(({id}) => id === req.params.id)
    if (blog) {
        return res.status(HTTP_STATUSES.OK_200).send(blog)
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

})
blogsRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
    if (blogs.find(({id}) => id === req.params.id)) {
        blogs = blogs.filter(({id}) => id !== req.params.id)
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
        .isLength({min: 1, max: 15}).withMessage('min 1, max 15 symbols'),
    body('description')
        .isString().withMessage('should be string')
        .isLength({min: 1, max: 500}).withMessage('min 1, max 500 symbols'),
    body('websiteUrl')
        .isString().withMessage('should be string')
        .isLength({min: 1, max: 100}).withMessage('min 1, max 500 symbols')
        .custom(({}, {req}) => {
            // let regex = new RegExp(/^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$)
            let regex = new RegExp(/^((https?):\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/)
            if (!regex.test(req.body.websiteUrl)) {
                throw new Error('incorrect url');
            }
            return true
        }),
    inputValidationMiddleware,
    (req: Request, res: Response) => {

        const newBlog: BlogType = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            id: new Date().toISOString()
        }
        blogs.push(newBlog)
        res.status(HTTP_STATUSES.CREATED_201).send(newBlog)

    })
blogsRouter.put(
    '/:id',
    authMiddleware,
    authMiddleware,
    body('name')
        .isString().withMessage('should be string')
        .isLength({min: 1, max: 15}).withMessage('min 1, max 15 symbols'),
    body('description')
        .isString().withMessage('should be string')
        .isLength({min: 1, max: 500}).withMessage('min 1, max 500 symbols'),
    body('websiteUrl')
        .isString().withMessage('should be string')
        .isLength({min: 1, max: 100}).withMessage('min 1, max 500 symbols')
        .custom(({}, {req}) => {
            // let regex = new RegExp(/^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$)
            let regex = new RegExp(/^((https?):\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/)
            if (!regex.test(req.body.websiteUrl)) {
                throw new Error('incorrect url');
            }
            return true
        }),
    inputValidationMiddleware,
    (req: Request, res: Response) => {
        let blog = blogs.find(({id}) => id === req.params.id)
        if (blog) {
            blog.name = req.body.name
            blog.description = req.body.description
            blog.websiteUrl = req.body.websiteUrl
            return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })
