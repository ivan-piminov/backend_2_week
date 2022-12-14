import bcrypt from 'bcrypt';

import { userRepository } from '../repositories/user-repository-db';
import { UsersType } from '../queryRepositories/user-query-repository';

export const userService = {
  async deleteUser(idReq: string): Promise<boolean> {
    return await userRepository.deleteUser(idReq);
  },
  async deleteAllUsers(): Promise<object> {
    return await userRepository.deleteAllUsers();
  },
  async addUser(
    login: string,
    password: string,
    email: string,
  ): Promise<UsersType | null> {
    const passwordSalt = await bcrypt.genSalt(5);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const newUser = {
      login,
      passwordHash,
      passwordSalt,
      email,
      id: new Date().getTime().toString(),
      createdAt: new Date().toISOString(),
    };
    return await userRepository.addUser(newUser);
  },
  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await userRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    const passwordHashCurrent = await this._generateHash(password, user.passwordSalt);
    if (passwordHashCurrent === user.passwordHash) {
      return user;
    }
    return false;
  },
  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  },

};
