import { usersCollection } from './db';
import { UsersType } from '../queryRepositories/user-query-repository';

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
      { id: newUser.id },
      { projection: { _id: false, passwordHash: false, passwordSalt: false } },
    );
  },
  async findByLoginOrEmail(loginOrEmail: string): Promise<UsersType | null> {
    return await usersCollection.findOne(
      {
        $or: [
          { email: loginOrEmail },
          { login: loginOrEmail }],
      },
      { projection: { _id: false } },
    );
  },

};
