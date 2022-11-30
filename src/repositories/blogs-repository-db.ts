import {BlogType} from "../types/types";
import {blogsCollection} from "./db";

export const blogsRepository = {
    async getBlogs(): Promise<BlogType[]> {
        const blogs =  await blogsCollection.find({}).toArray();
        return blogs.map(blog => {
            const {_id, ...rest} = blog
            return rest
        })
    },
    async getBlog(idReq: string): Promise<BlogType | null> {
        const blog = await blogsCollection.findOne({id: idReq})
        if (blog) {
            const {_id, ...rest} = blog
            return rest
        }
        return null
    },
    async deleteBlog(idReq: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: idReq})
        return result.deletedCount === 1
    },
    async addBlog(name: string, description: string, websiteUrl: string): Promise<BlogType | null> {
        const newBlog: BlogType = {
            name,
            description,
            websiteUrl,
            id: new Date().getTime().toString(),
            createdAt: new Date().toISOString()
        }
        await blogsCollection.insertOne(newBlog)
        const result = await blogsCollection.findOne({id: newBlog.id})
        // @ts-ignore
        const {_id, ...rest} = result
        return rest
    },
    async updateBlog(name: string, description: string, websiteUrl: string, idReq: string): Promise<boolean> {
        let result = await blogsCollection.updateOne(
            {id: idReq},
            {$set: {name, description, websiteUrl}})
        return result.matchedCount === 1
    }
}
