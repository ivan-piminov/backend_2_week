import express, {Request, Response} from 'express'
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {HTTP_STATUSES} from "./helpers/HTTP-statuses";
import {deletedPostsData} from "./repositories/post-repository";
import {deletedBlogsData} from "./repositories/blogs-repository";
import {runDb} from "./repositories/db";

const app = express()
const port = process.env.port || 3003

app.use(express.json())

/* todo нужно зарефакторить */
app.delete('/testing/all-data', (req: Request, res: Response) => {
    deletedBlogsData()
    deletedPostsData()
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
startApp()
