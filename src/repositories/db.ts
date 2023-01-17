import { MongoClient } from 'mongodb';

import { BlogType, TokenType } from '../types/types';
import { CommentType, PostType } from './post-repository-db';
import { UsersType } from '../queryRepositories/user-query-repository';
import { settings } from '../settings';

const mongoUri = settings.MONGO_URI;
export const client = new MongoClient(mongoUri);
const db = client.db('social');
export const blogsCollection = db.collection<BlogType>('blogs');
export const postsCollection = db.collection<PostType>('posts');
export const usersCollection = db.collection<UsersType>('users');
export const commentsCollection = db.collection<CommentType>('comments');
export const tokensCollection = db.collection<TokenType>('tokens');

export const runDb = async () => {
  try {
    await client.connect();
    await client.db('social').command({ ping: 1 });
    console.log('Соединение установлено');
  } catch {
    console.log('Error!!!');
    await client.close();
  }
};
