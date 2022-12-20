import { BlogType } from '../types/types';
import { blogsRepository } from '../repositories/blogs-repository-db';
import { postRepository, PostType } from '../repositories/post-repository-db';
import { blogsQueryRepository } from '../queryRepositories/blog-query-repository';
import { postQueryRepository } from '../queryRepositories/post-query-repository';

export const blogsService = {
  async deleteBlog(idReq: string): Promise<boolean> {
    return await blogsRepository.deleteBlog(idReq);
  },
  // eslint-disable-next-line @typescript-eslint/ban-types
  async deleteAllBlogs(): Promise<{}> {
    return await blogsRepository.deleteAllBlogs();
  },
  async addBlog(
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<BlogType | null> {
    const newBlog: BlogType = {
      name,
      description,
      websiteUrl,
      id: new Date().getTime().toString(),
      createdAt: new Date().toISOString(),
    };
    return await blogsRepository.addBlog(newBlog);
  },
  async addPostOnExistBlog(
    title: string,
    shortDescription: string,
    content: string,
    id: string,
  ): Promise<PostType | null> {
    // const blog = await blogsCollection.findOne({ id });
    const blog = await blogsQueryRepository.getBlog(id);
    if (!blog) {
      return null;
    }
    const newPostId = new Date().getTime().toString();
    const newPost = {
      id: new Date().getTime().toString(),
      title,
      shortDescription,
      content,
      blogId: id,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    await postRepository.addPost(newPost);
    return postQueryRepository.getPost(newPostId);
  },
  async updateBlog(
    name: string,
    description: string,
    websiteUrl: string,
    idReq: string,
  ): Promise<boolean> {
    return await blogsRepository.updateBlog(
      name,
      description,
      websiteUrl,
      idReq,
    );
  },
};
