import {BlogType} from "../types/types";
import {blogsCollection} from "../repositories/db";

export const blogsQueryRepository = {
    async getBlogs(): Promise<BlogType[]> {
        return await blogsCollection.find({},{projection: {_id: false}}).toArray();
    },
    async getBlog(idReq: string): Promise<BlogType | null> {
        return await blogsCollection.findOne({id: idReq}, {projection: {_id: false}})
    }
}
