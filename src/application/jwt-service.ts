import jwt from 'jsonwebtoken';

import { settings } from '../settings';
import { UsersType } from '../queryRepositories/user-query-repository';

/* пришлось расширить модуль jsonwebtoken, т.к. не видел userId */
declare module 'jsonwebtoken' {
  export interface UserIDJwtPayload extends jwt.JwtPayload {
    userId: string
  }
}

export const jwtService = {
  async createJWT(user: UsersType) {
    return jwt.sign(
      { userId: user.accountData.id },
      settings.JWT_SECRET,
      { expiresIn: '7d' },
    );
  },
  async getUSerIdByToken(token: string) {
    try {
      const result = <jwt.UserIDJwtPayload>jwt.verify(token, settings.JWT_SECRET);
      return result.userId as string;
    } catch (error) {
      return null;
    }
  },
};
