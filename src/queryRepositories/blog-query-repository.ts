import {BlogType} from "../types/types";
import {blogsCollection, postsCollection} from "../repositories/db";
import {PostType} from "../repositories/post-repository-db";

type PaginatorPostsType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostType[]
}

export const blogsQueryRepository = {
    async getBlogs(): Promise<BlogType[]> {
        return await blogsCollection.find({}, {projection: {_id: false}}).toArray();
    },
    async getBlog(idReq: string): Promise<BlogType | null> {
        return await blogsCollection.findOne({id: idReq}, {projection: {_id: false}})
    },
    async getPostsFromBlog(
        pageNumber: string = '1',
        pageSize: string = '10',
        sortBy: string = 'createdAt',
        sortDirection: string = 'desc',
        blogId: string
    ): Promise<PaginatorPostsType | null> {
        const isBlogExist = await blogsCollection.findOne({id: blogId})
        if (isBlogExist) {
            const totalCount = await postsCollection.count({blogId});
            const skip = (Number(pageNumber) - 1) * Number(pageSize)
            return {
                pagesCount: Math.ceil(totalCount / Number(pageSize)),
                page: Number(pageNumber),
                pageSize: Number(pageSize),
                totalCount,
                items: await postsCollection.find({blogId}, {projection: {_id: false}})
                    .skip(skip)
                    .limit(Number(pageSize))
                    .sort({sortBy: sortDirection === 'asc' ? 1 : -1})
                    .toArray()
            }
        }
        return null
    }
}
