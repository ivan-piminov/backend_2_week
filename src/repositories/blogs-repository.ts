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
    getBlogs() {
        return blogs
    },
    getBlog(idReq: string) {
        const blog = blogs.find(({id}) => id === idReq)
        if (blog) {
            return blog
        }
    },
    deleteBlog(idReq: string) {
        if (blogs.find(({id}) => id === idReq)) {
            blogs = blogs.filter(({id}) => id !== idReq)
            return blogs
        }
    },
    addPost(name: string, description: string, websiteUrl: string, id: string) {
        const newBlog: BlogType = {
            name,
            description,
            websiteUrl,
            id
        }
        blogs.push(newBlog)
        return newBlog
    },
    updatePost(name: string, description: string, websiteUrl: string, idReq: string) {
        let blog = blogs.find(({id}) => id === idReq)
        if (blog) {
            blog.name = name
            blog.description = description
            blog.websiteUrl = websiteUrl
            return blog
        }
    }
}
