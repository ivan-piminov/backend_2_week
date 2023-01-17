import jwt from 'jsonwebtoken';

import { settings } from '../settings';

/* пришлось расширить модуль jsonwebtoken, т.к. не видел userId */
declare module 'jsonwebtoken' {
  export interface UserIDJwtPayload extends jwt.JwtPayload {
    userId: string
  }
}

export const jwtService = {
  async createJWT(userId: string) {
    const accessToken = jwt.sign(
      { userId },
      settings.JWT_SECRET_ACCESS,
      { expiresIn: '10s' },
    );
    const refreshToken = jwt.sign(
      { userId },
      settings.JWT_SECRET_REFRESH,
      { expiresIn: '20s' },
    );
    return { accessToken, refreshToken };
  },
  async getUserIdByToken(token: string) {
    try {
      const result = <jwt.UserIDJwtPayload>jwt.verify(token, settings.JWT_SECRET_ACCESS);
      return result.userId as string;
    } catch (error) {
      return null;
    }
  },
};
