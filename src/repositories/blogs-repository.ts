import {BlogType} from "../types/types";

export let blogs = [
    {
        id: "1",
        name: "hello",
        description: 'fgggggg',
        websiteUrl: "aaaa.ru"
    },
    {
        id: "2",
        name: "hi33",
        description: 'ttttt',
        websiteUrl: "bbbb.ru"
    },
    {
        id: "3",
        name: "welcome",
        description: '898989',
        websiteUrl: "ccc.ru"
    }

]
export const deletedBlogsData = () => blogs = []

export const blogsRepository = {
    async getBlogs(): Promise<BlogType[]> {
        return  blogs
    },
    async getBlog(idReq: string): Promise<BlogType | null> {
        const blog = blogs.find(({id}) => id === idReq)
        if (blog) {
            return blog
        }
        return null
    },
    async deleteBlog(idReq: string): Promise<boolean | null> {
        if (blogs.find(({id}) => id === idReq)) {
            blogs = blogs.filter(({id}) => id !== idReq)
            return true
        }
        return null
    },
    async addPost(name: string, description: string, websiteUrl: string, id: string): Promise<BlogType> {
        const newBlog: BlogType = {
            name,
            description,
            websiteUrl,
            id
        }
        blogs.push(newBlog)
        return newBlog
    },
    async updatePost(name: string, description: string, websiteUrl: string, idReq: string): Promise<boolean | null> {
        let blog = blogs.find(({id}) => id === idReq)
        if (blog) {
            blog.name = name
            blog.description = description
            blog.websiteUrl = websiteUrl
            return true
        }
        return null
    }
}
