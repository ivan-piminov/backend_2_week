import {BlogType} from "../types/types";
import {blogsCollection, postsCollection} from "../repositories/db";
import {PostType} from "../repositories/post-repository-db";

type PaginatorPostsAndBlogsType<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T
}

export const blogsQueryRepository = {
    async getBlogs(
        searchNameTerm: string | null,
        pageNumber: string = '1',
        pageSize: string = '10',
        sortBy: string = 'createdAt',
        sortDirection: string = 'desc',
    ): Promise<PaginatorPostsAndBlogsType<BlogType[]>> {
        const totalCount = await blogsCollection.count({});
        const skip = (Number(pageNumber) - 1) * Number(pageSize)
        return {
            pagesCount: Math.ceil(totalCount / Number(pageSize)),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount,
            items: await blogsCollection.find(searchNameTerm ? {name: { $regex: searchNameTerm }, $options:'i'} : {}, {projection: {_id: false}})
                .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
                .skip(skip)
                .limit(Number(pageSize))
                .toArray()
        }
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
    ): Promise<PaginatorPostsAndBlogsType<PostType[]> | null> {
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
                    .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
                    .skip(skip)
                    .limit(Number(pageSize))
                    .toArray()
            }
        }
        return null
    }
}
