import { commentsCollection, postsCollection } from './db';
import { PostInputModelType } from '../domains/posts-service';

export type PostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    id: string,
    blogName?: string,
    createdAt: string
}
export type CommentType = {
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    createdAt: string
}

export const postRepository = {
  async deletePost(idReq: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({ id: idReq });
    return result.deletedCount === 1;
  },
  async deleteAllPosts(): Promise<{}> {
    return await postsCollection.deleteMany({});
  },
  async addPost(newPost: PostInputModelType & { id: string, createdAt: string }): Promise<PostType | null> {
    await postsCollection.insertOne(newPost);
    return await postsCollection.findOne({ id: newPost.id }, { projection: { _id: false } });
  },
  async addComment(newComment: CommentType, postId: string): Promise<null | CommentType> {
    /* проверяем существует ли такой пост, чтобы можно было оставить коммент */
    const post = await postsCollection.findOne({ id: postId });
    if (!post) return null;
    /* добавляем поле commentToPostId чтобы связать пост и коммент в базе */
    const newCommentWithPostId = { ...newComment, commentToPostId: postId };
    await commentsCollection.insertOne(newCommentWithPostId);
    return await commentsCollection.findOne(
      { id: newComment.id },
      { projection: { _id: false, commentToPostId: false } },
    );
  },
  async updatePost(
    idReqPost: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<boolean | null> {
    const post = await postsCollection.updateOne(
      { id: idReqPost },
      {
        $set: {
          title,
          shortDescription,
          content,
          blogId,
        },
      },
    );
    return post.matchedCount === 1;
  },

};
