import { commentsCollection, postsCollection } from '../repositories/db';
import { CommentType, PostType } from '../repositories/post-repository-db';
import { PaginatorType } from './types';

export const postQueryRepository = {
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
  async getComments(
    postId: string,
    pageNumber = '1',
    pageSize = '10',
    sortBy = 'createdAt',
    sortDirection = 'desc',
  ): Promise<PaginatorType<CommentType[]> | null> {
    /* проверяем есть ли пост с таким id */
    const post = await postsCollection.findOne({ id: postId });
    if (!post) return null;
    const totalCount = await commentsCollection.count({ commentToPostId: postId });
    const skip = (Number(pageNumber) - 1) * Number(pageSize);
    return {
      pagesCount: Math.ceil(totalCount / Number(pageSize)),
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount,
      items: await commentsCollection
        .find(
          { commentToPostId: postId },
          { projection: { _id: false, commentToPostId: false } },
        )
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(Number(pageSize))
        .toArray(),
    };
  },
  async getPost(id: string): Promise<PostType | null> {
    return await postsCollection.findOne({ id }, { projection: { _id: false } });
  },
};
