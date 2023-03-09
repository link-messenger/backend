import express from 'express';
import { Server as httpServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import 'express-async-errors';

import { connectMongo, connectRedis } from './src/config';
import { authMiddleware, dotenv } from './src/middlewares';
import { errorHandler } from './src/middlewares';
import { authRouter, groupRouter } from './src/routes';
import { getEnv } from './src/utils';

dotenv();

const PORT = getEnv('PORT');


const app = express();
const http = new httpServer(app);
const io = new Server(http, {
	cors: {
		origin: '*',
	}
});

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);



app.use(authMiddleware);

app.use('/auth', authRouter);
app.use('/group', groupRouter);
app.use(errorHandler);

http.listen(PORT, async () => {
	try {
		const client = createClient();
		client.on('error', (err) => console.log('Redis Client Error', err));
		await client.connect();
		await connectMongo();
		await connectRedis();
		console.log('server is running on port:', PORT);
  } catch (err) {
		console.error(err)
    process.exit(1);
  }
});
