import {BlogType} from "../types/types";
import {blogsCollection} from "./db";
import {WithId} from "mongodb";

/* todo не сделан кейс для удаления всех блогов */
// export const deletedBlogsData = () => __blogs = []

export const blogsRepository = {
    async getBlogs(): Promise<WithId<BlogType>[]> {
        return blogsCollection.find({}).toArray();
    },
    async getBlog(idReq: string): Promise<BlogType | null> {
        const blog = blogsCollection.findOne({id: idReq})
        if (blog) {
            return blog
        }
        return null
    },
    async deleteBlog(idReq: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: idReq})
        return result.deletedCount === 1
    },
    async addBlog(name: string, description: string, websiteUrl: string): Promise<BlogType> {
        const newBlog: BlogType = {
            name,
            description,
            websiteUrl,
            id: new Date().getTime().toString(),
            createdAt: new Date().toISOString()
        }
        await blogsCollection.insertOne(newBlog)
        return newBlog
    },
    async updateBlog(name: string, description: string, websiteUrl: string, idReq: string): Promise<boolean> {
        let result = await blogsCollection.updateOne(
            {id: idReq},
            {$set: {name, description, websiteUrl}})
        return result.matchedCount === 1
    }
}
