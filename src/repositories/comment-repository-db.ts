import { commentsCollection } from './db';
import { CommentType } from './post-repository-db';

export const commentsRepository = {
  async deleteComment(
    commentId: string,
    userId: string,
  ):Promise<number | CommentType | boolean> {
    const { deletedCount } = await commentsCollection.deleteOne({ id: commentId, userId });
    if (deletedCount) {
      return deletedCount;
    }
    const comment = await commentsCollection.findOne({ id: commentId });
    if (comment) {
      return comment;
    }
    return false;
  },
  async updateComment(
    commentId: string,
    userId: string,
    content: string,
  ):Promise<number | CommentType | boolean> {
    const { matchedCount } = await commentsCollection.updateOne(
      { id: commentId, userId },
      { $set: { content } },
    );
    if (matchedCount) {
      return matchedCount;
    }
    const comment = await commentsCollection.findOne({ id: commentId });
    if (comment) {
      return comment;
    }
    return false;
  },

};
