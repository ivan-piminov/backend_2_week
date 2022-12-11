import { postsCollection } from './db';
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
