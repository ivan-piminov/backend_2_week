import { commentsCollection } from '../repositories/db';
import { CommentType } from '../repositories/post-repository-db';

export const commentsQueryRepository = {
  async getComment(id: string): Promise<null | CommentType> {
    const comment = await commentsCollection.findOne(
      { id },
      { projection: { _id: false, commentToPostId: false } },
    );
    if (comment) {
      return comment;
    }
    return null;
  },

};
