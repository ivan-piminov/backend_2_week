import {BlogType} from "../types/types";
import {blogsRepository} from "../repositories/blogs-repository-db";

export const blogsService = {
    async deleteBlog(idReq: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(idReq)
    },
    async addBlog(
        name: string,
        description: string,
        websiteUrl: string
    ): Promise<BlogType | null> {
        const newBlog: BlogType = {
            name,
            description,
            websiteUrl,
            id: new Date().getTime().toString(),
            createdAt: new Date().toISOString()
        }
        return await blogsRepository.addBlog(newBlog)
    },
    async updateBlog(
        name: string,
        description: string,
        websiteUrl: string,
        idReq: string
    ): Promise<boolean> {
        return await blogsRepository.updateBlog(name, description, websiteUrl, idReq)
    }
}
