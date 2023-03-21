import express from 'express';
import { Server as httpServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import 'express-async-errors';
import colors from 'colors';

import { onlineUsers } from './src/global';
import {
	connectMongo,
	connectRedis,
	getMailer,
	onConnnect,
} from './src/config';
import {
	corsMiddleware,
	dotenv,
	errorHandler,
	loggerMiddleware,
	socketLoggerMiddleware,
} from './src/middlewares';
import {
	authRouter,
	chatRouter,
	conversationRouter,
	groupRouter,
	messageRouter,
	searchRouter,
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
	transports: ['websocket', 'polling'],
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
app.use('/search', searchRouter);
app.use('/chat', chatRouter);

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

		const mailer = getMailer();

		console.log(`[${colors.bold.green('SUCCESS')}] Redis Client Connected`);
		console.log(`[${colors.bold.green('SUCCESS')}] MongoDB Connected`);
		console.log(
			`[${colors.bold.green(
				'SUCCESS'
			)}] onlines: ${onlineUsers.getOnlineUsersCount()}`
		);
		console.log(
			`[${colors.bold.green(
				'SUCCESS'
			)}] Email Successfully connected: ${mailer.getEmail()}`
		);
		console.log(
			`[${colors.bold.green('SUCCESS')}] server is running on port:`,
			PORT
		);
	} catch (err: any) {
		console.error(colors.red(`[${colors.bold.bgRed('ERROR')}] ${err.message}`));
		process.exit(1);
	}
});
