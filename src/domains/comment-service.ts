import { commentsRepository } from '../repositories/comment-repository-db';
import { CommentType } from '../repositories/post-repository-db';

export const commentsService = {
  async deleteComment(commentId: string, userId: string): Promise<boolean | CommentType | number> {
    return await commentsRepository.deleteComment(commentId, userId);
  },
  async updateComment(
    commentId: string,
    userId: string,
    content: string,
  ): Promise<boolean | CommentType | number> {
    return await commentsRepository.updateComment(commentId, userId, content);
  },
};
