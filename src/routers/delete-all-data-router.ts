import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../helpers/HTTP-statuses";
import {blogsService} from "../domains/blogs-service";
import {postService} from "../domains/posts-service";
import {userService} from "../domains/user-service";

export const deleteRouter = Router({})

deleteRouter.delete('/all-data', async (req: Request, res: Response) => {
    await postService.deleteAllPosts()
    await blogsService.deleteAllBlogs()
    await userService.deleteAllUsers()
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
