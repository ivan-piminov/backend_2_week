import express, {Request, Response} from 'express'
import {blogsRouter, deletedBlogsData} from "./routers/blogs-router";
import {deletedPostsData, postsRouter} from "./routers/posts-router";
const app = express()
const port = process.env.port ||  3003

app.use(express.json())

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
}

app.delete('/testing/all-data', (req: Request, res: Response) => {
    deletedBlogsData()
    deletedPostsData()
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
