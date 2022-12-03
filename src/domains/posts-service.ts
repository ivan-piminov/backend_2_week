import {PostType} from "../types/types";
import {postRepository} from "../repositories/post-repository-db";

export const postService = {
    async getPosts(): Promise<PostType[]> {
        return await postRepository.getPosts()
    },
    async getPost(idReq: string): Promise<PostType | null> {
        return await postRepository.getPost(idReq)
    },
    async deletePost(idReq: string): Promise<boolean> {
        return await postRepository.deletePost(idReq)
    },
    async addPost(
        title: string,
        shortDescription: string,
        content: string,
        blogIdReq: string,
    ): Promise<PostType | null> {
            const newPost: PostType = {
                title,
                shortDescription,
                content,
                blogId: blogIdReq,
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

