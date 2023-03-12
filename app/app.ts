import express from 'express';
import { Server as httpServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import 'express-async-errors';
import colors from 'colors';

import { connectMongo, connectRedis, onConnnect } from './src/config';
import {
	corsMiddleware,
	dotenv,
	errorHandler,
	loggerMiddleware,
	socketErrorHandler,
	socketLoggerMiddleware,
} from './src/middlewares';
import {
	authRouter,
	conversationRouter,
	groupRouter,
	messageRouter,
} from './src/routes';
import { getEnv } from './src/utils';

dotenv();
const PORT = getEnv('PORT');

const app = express();
const http = new httpServer(app);
const io = new Server(http, {
	cors: {
		origin: '*',
	},
});

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(corsMiddleware());

io.use(socketLoggerMiddleware);
io.on('connect', onConnnect);

app.use(loggerMiddleware);

app.use('/auth', authRouter);
app.use('/group', groupRouter);
app.use('/conversation', conversationRouter);
app.use('/message', messageRouter);

app.use(errorHandler);

http.listen(PORT, async () => {
	try {
		const client = createClient();
		client.on('error', (err) =>
			console.log(`[${colors.red('SETUP ERROR')}] Redis Client Error`, err)
		);
		await client.connect();
		await connectMongo();
		await connectRedis();
		console.log(
			`[${colors.bold.green('SUCCESS')}] server is running on port:`,
			PORT
		);
	} catch (err: any) {
		console.error(colors.red(`[${colors.bold.bgRed('ERROR')}] ${err.message}`));
		process.exit(1);
	}
});
