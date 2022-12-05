import {postRepository, PostType} from "../repositories/post-repository-db";
import {blogsCollection} from "../repositories/db";
export type PostInputModelType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}
export const postService = {
    async deletePost(idReq: string): Promise<boolean> {
        return await postRepository.deletePost(idReq)
    },
    async addPost(
        title: string,
        shortDescription: string,
        content: string,
        blogIdReq: string,
    ): Promise<PostType | null> {
        const blog = await blogsCollection.findOne({id: blogIdReq})
            const newPost = {
                title,
                shortDescription,
                content,
                blogId: blogIdReq,
                blogName: blog && blog.name,
                id: new Date().getTime().toString(),
                createdAt: new Date().toISOString(),
            }
            return await postRepository.addPost(newPost)
    },
    async updatePost(
        idReqPost: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string
    ): Promise<boolean | null> {
        return await postRepository.updatePost(
            idReqPost,
            title,
            shortDescription,
            content,
            blogId
        )
    }
}

