import { tokenRepository } from '../repositories/token-repository-db';

export const tokenService = {
  async saveRefreshJWT(token: string, id: string) {
    return await tokenRepository.saveToken(token, id);
  },
  async checkRefreshJWT(token: string) {
    return await tokenRepository.checkToken(token);
  },
  async findUserByToken(token: string) {
    return await tokenRepository.findUserByToken(token);
  },
  async deleteTokenInfo(token: string) {
    return await tokenRepository.deleteTokenInfo(token);
  },

};
