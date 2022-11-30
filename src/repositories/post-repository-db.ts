import {PostType} from "../types/types";
import {blogsCollection, postsCollection} from "./db";

export const postRepository = {
    async getPosts(): Promise<PostType[]> {
        const posts = await postsCollection.find({}).toArray()
        return posts.map(post => {
            const {_id, ...rest} = post
            return rest
        })
    },
    async getPost(idReq: string): Promise<PostType | null> {
        const post = await postsCollection.findOne({id: idReq})
        if (post) {
            const {_id, ...rest} = post
            return rest
        }
        return null
    },
    async deletePost(idReq: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id: idReq})
        return result.deletedCount === 1
    },
    async addPost(
        title: string,
        shortDescription: string,
        content: string,
        blogIdReq: string,
    ): Promise<PostType | boolean> {
        const blog = await blogsCollection.findOne({id: blogIdReq})
        if (blog) {
            const newPost: PostType = {
                title,
                shortDescription,
                content,
                blogId: blogIdReq,
                id: new Date().getTime().toString(),
                createdAt: new Date().toISOString(),
                blogName: blog.name
            }
            await postsCollection.insertOne(newPost)
            const result = await postsCollection.findOne({id: newPost.id})
            // @ts-ignore
            const {_id, ...rest} = result
            return rest
        }
        return false
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

