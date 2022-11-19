import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../index";
import {authMiddleware} from "../uath/middleware/auth-middliware";
import {body, validationResult} from "express-validator";
import {customValidationResult} from "../helpers/custom-validation-result";
import {inputValidationMiddleware} from "../uath/middleware/input-post-vaditation-middleware";

export const postsRouter = Router({})
type BlogType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    id: string,
    blogName: string
}

export let posts = [
    {
        id: "4",
        title: "dog",
        shortDescription: "aboutDog",
        content: "dgfdgdfdfdfdfd888",
        blogId: "1",
        blogName: "hello"
    },
    {
        id: "5",
        title: "cat",
        shortDescription: "aboutCat",
        content: "ooooooo888",
        blogId: "2",
        blogName: "hi33"
    },
    {
        id: "6",
        title: "wolf",
        shortDescription: "aboutWolf",
        content: "aboutWolf7878878",
        blogId: "3",
        blogName: "welcome"
    }
]
export const deletedPostsData = () => posts = []

postsRouter.get('/', (req: Request, res: Response) => {
    res.status(HTTP_STATUSES.OK_200).send(posts)
})
postsRouter.get('/:id', (req: Request, res: Response) => {
    const post = posts.find(({id}) => id === req.params.id)
    if (post) {
        return res.status(HTTP_STATUSES.OK_200).send(post)
    }
    /* не обработан кейс Bad Request см доку */
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
postsRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
    if (posts.find(({id}) => id === req.params.id)) {
        posts = posts.filter(({id}) => id !== req.params.id)
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
postsRouter.post(
    '/',
    authMiddleware,
    body('title')
        .isString().withMessage('should be string')
        .isLength({min: 1, max: 30}).withMessage('min 1, max 30 symbols'),
    body('shortDescription')
        .isString().withMessage('should be string')
        .isLength({min: 1, max: 100}).withMessage('min 1, max 100 symbols'),
    body('content')
        .isString().withMessage('should be string')
        .isLength({min: 1, max: 1000}).withMessage('min 1, max 1000 symbols'),
    body('blogId')
        .isString().withMessage('should be string'),
    inputValidationMiddleware
    // .isLength({min: 1, max: 1000}).withMessage('min 1, max 1000 symbols')
    ,
    (req: Request, res: Response) => {
        const newPost: BlogType = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            id: new Date().toISOString(),
            /* убрать потом пустую строку? */
            blogName: posts.find(({blogId}) => blogId === req.body.blogId)?.blogName || ''
        }
        posts.push(newPost)
        res.status(HTTP_STATUSES.CREATED_201).send(newPost)

    })
postsRouter.put(
    '/:id',
    authMiddleware,
    body('title')
        .isString().withMessage('should be string')
        .isLength({min: 1, max: 30}).withMessage('min 1, max 30 symbols'),
    body('shortDescription')
        .isString().withMessage('should be string')
        .isLength({min: 1, max: 100}).withMessage('min 1, max 100 symbols'),
    body('content')
        .isString().withMessage('should be string')
        .isLength({min: 1, max: 1000}).withMessage('min 1, max 1000 symbols'),
    body('blogId')
        .isString().withMessage('should be string'),
    inputValidationMiddleware,
    (req: Request, res: Response) => {

    let post = posts.find(({id}) => id === req.params.id)
    if (post) {
        post.title = req.body.title
        post.shortDescription = req.body.shortDescription
        post.content = req.body.content
        post.blogId = req.body.blogId
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
