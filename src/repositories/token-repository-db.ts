import { InsertOneResult } from 'mongodb';

import { tokensCollection } from './db';
import { TokenType } from '../types/types';

export const tokenRepository = {
  async saveToken(token: string, id: string): Promise<InsertOneResult<TokenType> | boolean> {
    const existUserId = await tokensCollection.findOne({ userId: id });
    if (existUserId) {
      await tokensCollection.updateOne({ userId: id }, { $set: { token } });
      return true;
    }
    return await tokensCollection.insertOne({ userId: id, token });
  },
  async checkToken(token: string): Promise<boolean | TokenType> {
    const result = await tokensCollection.findOne({ token });
    if (result) {
      return result;
    }
    return false;
  },
  async updateRefreshToken(userId: string, token: string): Promise<boolean> {
    await tokensCollection.updateOne(
      { userId },
      { $set: { token } },
    );
    return true;
  },
  async findUserByToken(token: string): Promise<TokenType | boolean> {
    const user = await tokensCollection.findOne({ token });
    if (user) {
      return user;
    }
    return false;
  },
  async deleteTokenInfo(token: string): Promise<boolean> {
    const res = await tokensCollection.deleteOne({ token });
    return res.deletedCount === 1;
  },
};
