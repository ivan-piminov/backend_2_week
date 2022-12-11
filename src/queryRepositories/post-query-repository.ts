import { postsCollection } from '../repositories/db';
import { PostType } from '../repositories/post-repository-db';
import { PaginatorType } from './types';

export const postQueryService = {
  async getPosts(
    pageNumber = '1',
    pageSize = '10',
    sortBy = 'createdAt',
    sortDirection = 'desc',
  ): Promise<PaginatorType<PostType[]>> {
    const totalCount = await postsCollection.count({});
    const skip = (Number(pageNumber) - 1) * Number(pageSize);
    return {
      pagesCount: Math.ceil(totalCount / Number(pageSize)),
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount,
      items: await postsCollection
        .find({}, { projection: { _id: false } })
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(Number(pageSize))
        .toArray(),
    };
  },
  async getPost(idReq: string): Promise<PostType | null> {
    return await postsCollection.findOne({ id: idReq }, { projection: { _id: false } });
  },
};
