import { postRepository, PostType } from '../repositories/post-repository-db';
import { blogsCollection } from '../repositories/db';
import {blogsQueryRepository} from "../queryRepositories/blog-query-repository";

export type PostInputModelType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}
export const postService = {
  async deletePost(idReq: string): Promise<boolean> {
    return await postRepository.deletePost(idReq);
  },
  // eslint-disable-next-line @typescript-eslint/ban-types
  async deleteAllPosts(): Promise<{}> {
    return await postRepository.deleteAllPosts();
  },
  async addPost(
    title: string,
    shortDescription: string,
    content: string,
    blogIdReq: string,
  ): Promise<PostType | null> {
    const blog = await blogsQueryRepository.getBlog(blogIdReq);
    const newPost = {
      title,
      shortDescription,
      content,
      blogId: blogIdReq,
      blogName: blog && blog.name,
      id: new Date().getTime().toString(),
      createdAt: new Date().toISOString(),
    };
    return await postRepository.addPost(newPost);
  },
  async updatePost(
    idReqPost: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<boolean | null> {
    return await postRepository.updatePost(
      idReqPost,
      title,
      shortDescription,
      content,
      blogId,
    );
  },
  async addComment(
    content: string,
    postId: string,
    userId: string,
    userLogin: string,
  ) {
    const newComment = {
      content,
      userId,
      userLogin,
      id: new Date().getTime().toString(),
      createdAt: new Date().toISOString(),
    };
    return await postRepository.addComment(newComment, postId);
  },
};
