import { UpdateResult } from 'mongodb';

import { usersCollection } from './db';
import { UsersType } from '../queryRepositories/user-query-repository';
import { EmailAdapter } from '../adapters/email-adapter';

export const userRepository = {
  async deleteUser(idReq: string): Promise<boolean> {
    const result = await usersCollection.deleteOne({ id: idReq });
    return result.deletedCount === 1;
  },
  async deleteAllUsers(): Promise<object> {
    return await usersCollection.deleteMany({});
  },
  async addUser(newUser: UsersType): Promise<UsersType | null> {
    await usersCollection.insertOne(newUser);
    return await usersCollection.findOne(
      { id: newUser.accountData.id },
      /* переделать ответ с учетом запроса - сам регается юзер или добавляет супер админ */
      {
        projection: {
          _id: false,
          emailConfirmations: false,
          'accountData.passwordSalt': false,
          'accountData.passwordHash': false,
        },
      },
    );
  },
  async findByLoginOrEmail(loginOrEmail: string): Promise<UsersType | null> {
    return await usersCollection.findOne(
      {
        $or: [
          { 'accountData.email': loginOrEmail },
          { 'accountData.login': loginOrEmail }],
      },
      { projection: { _id: false } },
    );
  },
  async updateConfirmation(code: string): Promise<UpdateResult> {
    return await usersCollection.updateOne(
      { 'emailConfirmations.confirmationCode': code },
      { $set: { 'emailConfirmations.isConfirmed': true } },
    );
  },
};
