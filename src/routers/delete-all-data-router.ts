import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../helpers/HTTP-statuses";
import {blogsCollection, postsCollection} from "../repositories/db";

export const deleteRouter = Router({})

deleteRouter.delete('/all-data', async (req: Request, res: Response) => {
    await postsCollection.deleteMany({})
    await blogsCollection.deleteMany({})
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
