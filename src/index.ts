import express from 'express'
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {runDb} from "./repositories/db";
import {deleteRouter} from "./routers/delete-all-data-router";
import {usersRouter} from "./routers/user-router";
import {authRouter} from "./routers/auth-router";
import cors from 'cors'

const app = express()
const port = process.env.port || 3003

app.use(cors())
app.use(express.json())
app.use('/testing', deleteRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
startApp()
