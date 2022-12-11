import { BlogType } from '../types/types';
import { blogsCollection, postsCollection } from '../repositories/db';
import { PostType } from '../repositories/post-repository-db';
import { PaginatorType } from './types';

export const blogsQueryRepository = {
  async getBlogs(
    searchNameTerm: string | null,
    pageNumber = '1',
    pageSize = '10',
    sortBy = 'createdAt',
    sortDirection = 'desc',
  ): Promise<PaginatorType<BlogType[]>> {
    const totalCount = await blogsCollection.count(searchNameTerm ? {
      name: {
        $regex: searchNameTerm,
        $options: 'i',
      },
    } : {});
    const skip = (Number(pageNumber) - 1) * Number(pageSize);
    return {
      pagesCount: Math.ceil(totalCount / Number(pageSize)),
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount,
      items: await blogsCollection.find(searchNameTerm ? {
        name: {
          $regex: searchNameTerm,
          $options: 'i',
        },
      } : {}, { projection: { _id: false } })
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(Number(pageSize))
        .toArray(),
    };
  },
  async getBlog(idReq: string): Promise<BlogType | null> {
    return await blogsCollection.findOne({ id: idReq }, { projection: { _id: false } });
  },
  async getPostsFromBlog(
    pageNumber = '1',
    pageSize = '10',
    sortBy = 'createdAt',
    sortDirection = 'desc',
    blogId: string,
  ): Promise<PaginatorType<PostType[]> | null> {
    const isBlogExist = await blogsCollection.findOne({ id: blogId });
    if (isBlogExist) {
      const totalCount = await postsCollection.count({ blogId });
      const skip = (Number(pageNumber) - 1) * Number(pageSize);
      return {
        pagesCount: Math.ceil(totalCount / Number(pageSize)),
        page: Number(pageNumber),
        pageSize: Number(pageSize),
        totalCount,
        items: await postsCollection.find({ blogId }, { projection: { _id: false } })
          .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
          .skip(skip)
          .limit(Number(pageSize))
          .toArray(),
      };
    }
    return null;
  },
};
