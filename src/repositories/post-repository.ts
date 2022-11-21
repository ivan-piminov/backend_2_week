import {PostType} from "../types/types";

export let posts = [
    {
        id: "4",
        title: "dog",
        shortDescription: "aboutDog",
        content: "dgfdgdfdfdfdfd888",
        blogId: "1",
        blogName: "hello"
    },
    {
        id: "5",
        title: "cat",
        shortDescription: "aboutCat",
        content: "ooooooo888",
        blogId: "2",
        blogName: "hi33"
    },
    {
        id: "6",
        title: "wolf",
        shortDescription: "aboutWolf",
        content: "aboutWolf7878878",
        blogId: "3",
        blogName: "welcome"
    }
]
export const deletedPostsData = () => posts = []

export const postRepository = {
    getPosts() {
        return posts
    },
    getPost(idReq: string) {
        const post = posts.find(({id}) => id === idReq)
        if (post) {
            return post
        }
    },
    deletePost(idReq: string) {
        if (posts.find(({id}) => id === idReq)) {
            posts = posts.filter(({id}) => id !== idReq)
            return posts
        }
    },
    addPost(
        title: string,
        shortDescription: string,
        content: string,
        blogIdReq: string,
    ) {
        const newPost: PostType = {
            title,
            shortDescription,
            content,
            blogId: blogIdReq,
            id: new Date().toISOString(),
            /* убрать потом пустую строку? */
            blogName: posts.find(({blogId}) => blogId === blogIdReq)?.blogName || ''
        }
        posts.push(newPost)
        return newPost
    },
    updatePost(
        idReqPost: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string
    ) {
        let post = posts.find(({id}) => id === idReqPost)
        if (post) {
            post.title = title
            post.shortDescription = shortDescription
            post.content = content
            post.blogId = blogId
            return post
        }
    }
}

