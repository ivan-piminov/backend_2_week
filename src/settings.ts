export const settings = {
  MONGO_URI: process.env.mongoUri
      || 'mongodb+srv://lesson_3:qwerty123@cluster0.out97bu.mongodb.net/?retryWrites=true&w=majority',
  JWT_SECRET: process.env.JWT_SECRET || '789',
};
