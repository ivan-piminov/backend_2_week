import { BlogType } from '../types/types';
import { blogsRepository } from '../repositories/blogs-repository-db';
import { blogsCollection, postsCollection } from '../repositories/db';
import { PostType } from '../repositories/post-repository-db';

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
    const blog = await blogsCollection.findOne({ id });
    if (!blog) {
      return null;
    }
    const newPostId = new Date().getTime().toString();
    await postsCollection.insertOne({
      id: newPostId,
      title,
      shortDescription,
      content,
      blogId: id,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    });
    return postsCollection.findOne({ id: newPostId }, { projection: { _id: false } });
  },
  async updateBlog(
    name: string,
    description: string,
    websiteUrl: string,
    idReq: string,
  ): Promise<boolean> {
    return await blogsRepository.updateBlog(name, description, websiteUrl, idReq);
  },
};
