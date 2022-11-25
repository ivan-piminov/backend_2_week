import {MongoClient} from 'mongodb'
const mongoUri = process.env.mongoUri || 'mongodb+srv://lesson_3:hometask@cluster0.out97bu.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(mongoUri)
export const runDb = async () => {
    try{
        await client.connect()
        await client.db('lesson_3').command({ping: 1})
        console.log('Соединение установлено')
    }
    catch {
        console.log('Error!!!')
        await client.close()
    }
}
