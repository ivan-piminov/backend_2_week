import {postsCollection} from "../repositories/db";
import {PostType} from "../repositories/post-repository-db";

type PaginatorPostsAndBlogsType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostType[]
}

export const postQueryService = {
    async getPosts(
        pageNumber: string = '1',
        pageSize: string = '10',
        sortBy: string = 'createdAt',
        sortDirection: string = 'desc',
    ): Promise<PaginatorPostsAndBlogsType> {
        const totalCount = await postsCollection.count({});
        const skip = (Number(pageNumber) - 1) * Number(pageSize)
        return {
            pagesCount: Math.ceil(totalCount / Number(pageSize)),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount,
            items: await postsCollection
                .find({}, {projection: {_id: false}})
                .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
                .skip(skip)
                .limit(Number(pageSize))
                .toArray()
        }
    },
    async getPost(idReq: string): Promise<PostType | null> {
        return await postsCollection.findOne({id: idReq}, {projection: {_id: false}})
    },
}

