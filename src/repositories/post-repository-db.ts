import {PostType} from "../types/types";
import {postsCollection} from "./db";

export const postRepository = {
    async getPosts(): Promise<PostType[]> {
        return await postsCollection.find({}, {projection: {_id: false}}).toArray()
    },
    async getPost(idReq: string): Promise<PostType | null> {
        return await postsCollection.findOne({id: idReq}, {projection: {_id: false}})
    },
    async deletePost(idReq: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id: idReq})
        return result.deletedCount === 1
    },
    async addPost(newPost: PostType): Promise<PostType | null> {
        await postsCollection.insertOne(newPost)
        return await postsCollection.findOne({id: newPost.id}, {projection: {_id: false}})
    },
    async updatePost(
        idReqPost: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string
    ): Promise<boolean | null> {
        let post = await postsCollection.updateOne(
            {id: idReqPost},
            {
                $set: {
                    title,
                    shortDescription,
                    content,
                    blogId,
                }
            }
        )
        return post.matchedCount === 1
    }

}

