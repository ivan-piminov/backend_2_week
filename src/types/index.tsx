import { UsersType } from '../queryRepositories/user-query-repository';

declare module 'express-serve-static-core' {
    interface Request {
        user: UsersType | null
    }
}
