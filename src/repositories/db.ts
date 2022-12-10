import {MongoClient} from 'mongodb'
import {BlogType} from "../types/types";
import {PostType} from "./post-repository-db";
import {UsersType} from "../queryRepositories/user-query-repository";

const mongoUri = process.env.mongoUri || 'mongodb+srv://lesson_3:qwerty123@cluster0.out97bu.mongodb.net/?retryWrites=true&w=majority'
export const client = new MongoClient(mongoUri)
const db = client.db('social')
export const blogsCollection = db.collection<BlogType>('blogs')
export const postsCollection = db.collection<PostType>('posts')
export const usersCollection = db.collection<UsersType>('users')

export const runDb = async () => {
    try {
        await client.connect()
        await client.db('social').command({ping: 1})
        console.log('Соединение установлено')
    } catch {
        console.log('Error!!!')
        await client.close()
    }
}
