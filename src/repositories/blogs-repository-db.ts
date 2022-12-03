import {BlogType} from "../types/types";
import {blogsCollection} from "./db";

export const blogsRepository = {
    async getBlogs(): Promise<BlogType[]> {
        return await blogsCollection.find({},{projection: {_id: false}}).toArray();
    },
    async getBlog(idReq: string): Promise<BlogType | null> {
        return await blogsCollection.findOne({id: idReq}, {projection: {_id: false}})
    },
    async deleteBlog(idReq: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: idReq})
        return result.deletedCount === 1
    },
    async addBlog(newBlog: BlogType): Promise<BlogType | null> {
        await blogsCollection.insertOne(newBlog)
        return  await blogsCollection.findOne({id: newBlog.id}, {projection: {_id: false}})
    },
    async updateBlog(name: string, description: string, websiteUrl: string, idReq: string): Promise<boolean> {
        let result = await blogsCollection.updateOne(
            {id: idReq},
            {$set: {name, description, websiteUrl}})
        return result.matchedCount === 1
    }
}
