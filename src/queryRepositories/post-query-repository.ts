import {postsCollection} from "../repositories/db";
import {PostType} from "../repositories/post-repository-db";

export const postQueryService = {
    async getPosts(): Promise<PostType[]> {
        return await postsCollection.find({}, {projection: {_id: false}}).toArray()
    },
    async getPost(idReq: string): Promise<PostType | null> {
        return await postsCollection.findOne({id: idReq}, {projection: {_id: false}})
    },
}

