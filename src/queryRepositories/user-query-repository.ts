import {usersCollection} from "../repositories/db";
import {PaginatorType} from "./types";

export type UsersType = {
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: string
}

export const userQueryService = {
    async getUsers(
        pageNumber: string = '1',
        pageSize: string = '10',
        sortBy: string = 'createdAt',
        sortDirection: string = 'desc',
        searchLoginTerm: string | null = null,
        searchEmailTerm: string | null = null
    ): Promise<PaginatorType<UsersType[]>> {
        const totalCount = searchLoginTerm || searchEmailTerm
            ? await usersCollection.count({$or: [{login: {$regex: searchLoginTerm || ''}}, {email: {$regex: searchEmailTerm || ''}}]})
            : await usersCollection.count({});
        const skip = (Number(pageNumber) - 1) * Number(pageSize)
        return {
            pagesCount: Math.ceil(totalCount / Number(pageSize)),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount,
            items: await usersCollection.find(searchLoginTerm || searchEmailTerm
                    ? {$or: [{login: {$regex: searchLoginTerm || '', $options: 'i'}}, {email: {$regex: searchEmailTerm || ''}}]}
                    : {},
                {projection: {_id: false, passwordHash: false, passwordSalt: false}})
                .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
                .skip(skip)
                .limit(Number(pageSize))
                .toArray()
        }
    },
}
