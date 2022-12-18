import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

import { userRepository } from '../repositories/user-repository-db';
import { UsersType } from '../queryRepositories/user-query-repository';
import { EmailAdapter } from '../adapters/email-adapter';
import { usersCollection } from '../repositories/db';

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
    createdBySuperAdmin?: boolean,
  ): Promise<UsersType | null> {
    const passwordSalt = await bcrypt.genSalt(5);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const newUser = {
      accountData: {
        login,
        passwordHash,
        passwordSalt,
        email,
        id: new Date().getTime().toString(),
        createdAt: new Date().toISOString(),
      },
      emailConfirmations: {
        isConfirmed: false,
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 1 }),
      },
    };
    if (createdBySuperAdmin) {
      await userRepository.addUser(newUser);
      return await usersCollection.findOne(
        { 'accountData.id': newUser.accountData.id },
        {
          projection: {
            _id: false,
            id: '$accountData.id',
            login: '$accountData.login',
            email: 'accountData.email',
            createdAt: 'accountData.createdAt',
          },
        },
      );
    }
    try {
      await userRepository.addUser(newUser);
      await EmailAdapter.sendEmail(
        email,
        `Hello! Here code for Registration ${newUser.emailConfirmations.confirmationCode}`,
        'Registration',
      );
      return await usersCollection.findOne({ 'accountData.id': newUser.accountData.id });
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await userRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    const passwordHashCurrent = await this._generateHash(password, user.accountData.passwordSalt);
    if (passwordHashCurrent === user.accountData.passwordHash) {
      return user;
    }
    return false;
  },
  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  },

};
