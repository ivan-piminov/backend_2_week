import { BlogType } from '../types/types';
import { blogsCollection } from './db';

export const blogsRepository = {
  async deleteBlog(idReq: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({ id: idReq });
    return result.deletedCount === 1;
  },
  async deleteAllBlogs(): Promise<object> {
    return await blogsCollection.deleteMany({});
  },
  async addBlog(newBlog: BlogType): Promise<BlogType | null> {
    await blogsCollection.insertOne(newBlog);
    return await blogsCollection.findOne(
      { id: newBlog.id },
      { projection: { _id: false } },
    );
  },
  async updateBlog(
    name: string,
    description: string,
    websiteUrl: string,
    idReq: string,
  ): Promise<boolean> {
    const result = await blogsCollection.updateOne(
      { id: idReq },
      { $set: { name, description, websiteUrl } },
    );
    return result.matchedCount === 1;
  },
};
