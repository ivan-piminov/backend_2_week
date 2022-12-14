import express from 'express';
import cors from 'cors';
import { blogsRouter } from './routers/blogs-router';
import { postsRouter } from './routers/posts-router';
import { runDb } from './repositories/db';
import { deleteRouter } from './routers/delete-all-data-router';
import { usersRouter } from './routers/user-router';
import { authRouter } from './routers/auth-router';
import { commentsRouter } from './routers/comments-router';

const app = express();
const port = process.env.port || 3003;

app.use(cors());
app.use(express.json());
app.use('/testing', deleteRouter);
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/comments', commentsRouter);
const startApp = async () => {
  await runDb();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};
startApp();
