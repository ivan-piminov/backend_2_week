import { usersCollection } from '../repositories/db';
import { PaginatorType } from './types';

export type UsersType = {
    accountData: {
        login: string,
        passwordHash: string,
        passwordSalt: string,
        email: string,
        id: string,
        createdAt: string,
    },
    emailConfirmations: {
        isConfirmed: boolean,
        confirmationCode: string,
        expirationDate: Date,
    }
}

export const userQueryRepository = {
  async getUsers(
    pageNumber = '1',
    pageSize = '10',
    sortBy = 'createdAt',
    sortDirection = 'desc',
    searchLoginTerm: string | null = null,
    searchEmailTerm: string | null = null,
  ): Promise<PaginatorType<UsersType[]>> {
    const totalCount = searchLoginTerm || searchEmailTerm
      ? await usersCollection.count({
        $or: [{ login: { $regex: searchLoginTerm || '', $options: 'i' } },
          { email: { $regex: searchEmailTerm || '' } }],
      })
      : await usersCollection.count({});
    const skip = (Number(pageNumber) - 1) * Number(pageSize);
    return {
      pagesCount: Math.ceil(totalCount / Number(pageSize)),
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount,
      items: await usersCollection.find(
        searchLoginTerm || searchEmailTerm
          ? {
            $or: [
              { login: { $regex: searchLoginTerm || '', $options: 'i' } },
              { email: { $regex: searchEmailTerm || '' } }],
          }
          : {},
        { projection: { _id: false, passwordHash: false, passwordSalt: false } },
      )
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(Number(pageSize))
        .toArray(),
    };
  },
  async getUserById(id: string):Promise<UsersType | null> {
    return await usersCollection.findOne(
      { id },
      {
        projection: {
          _id: false, passwordHash: false, passwordSalt: false, createdAt: false,
        },
      },
    );
  },
  async findUserByConfirmationCode(code: string): Promise<UsersType | null> {
    return await usersCollection.findOne({ 'emailConfirmations.confirmationCode': code });
  },
  async findUserByEmail(email: string): Promise<UsersType | null> {
    return await usersCollection.findOne({ 'accountData.email': email });
  },
};
