import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { NotFoundError, UnauthorizedError } from '../errors';
import { activeStreams } from '../global';
import { hasUser } from '../guards/server.guard';
import { Stream } from '../models';
import { getEnv } from '../utils';

export const createStreamController = async (req: Request, res: Response) => {
	if (!hasUser(req))
		throw new UnauthorizedError(
			'You are not authorized to create a stream. Please login first.'
		);
	const user = req.user;
	const { title } = req.body;
	const key = nanoid();
	const stream = await Stream.create({
		title,
		user: user._id,
		key,
	});
	stream.save();
	activeStreams.add(key, {
		id: stream._id.toString(),
		status: 'deactive',
	});
	const ex = parseInt(getEnv('APP_STREAM_EX_KEY'));
	setTimeout(() => {
		if (activeStreams.getStream(key)?.status === 'deactive') {
			activeStreams.remove(key);
		}
	}, ex);

	res.status(200).json({
		message:
			'Stream created successfully | this key will be expired if left unused for 10 minutes',
		stream: {
			key,
			title,
			_id: stream._id,
			createdAt: stream.createdAt,
		},
	});
};

export const getOnlineStreamListController = async (
	req: Request,
	res: Response
) => {
	if (!hasUser(req))
		throw new UnauthorizedError(
			'You are not authorized to create a stream. Please login first.'
		);

	const streams = await Stream.find(
		{
			key: { $in: [...activeStreams.getOnlineKeys()] },
		},
		{
			title: 1,
			_id: 1,
			createdAt: 1,
		},
		{
			populate: {
				path: 'user',
				select: 'username avatar',
			},
		}
	);

	res.status(200).json({
		streams,
	});
};

export const getOnlineStream = async (req: Request, res: Response) => {
	if (!hasUser(req))
		throw new UnauthorizedError(
			'You are not authorized to create a stream. Please login first.'
		);
	const { id } = req.params;

	const stream = await Stream.findById(
		id,
		{
			title: 1,
			_id: 1,
			key: 1,
			createdAt: 1,
			user: 1,
		},
		{
			populate: {
				path: 'user',
				select: 'username avatar',
			},
		}
	);

	if (!stream) {
		throw new NotFoundError('Stream not found');
	}
	const streamActivity = activeStreams.getStream(stream.key);
	if (!streamActivity || streamActivity.status === 'deactive') {
		throw new NotFoundError('Stream not found');
	}
	const path = `/live/${stream.key}`;

	res.status(200).json({
		title: stream.title,
		_id: stream._id,
		user: stream.user,
		path,
	});
};

export const getUserStreams = async (req: Request, res: Response) => {
	if (!hasUser(req))
		throw new UnauthorizedError(
			'You are not authorized to create a stream. Please login first.'
		);
	const { username } = req.params;
	const streams = await Stream.find(
		{
			user: {
				username,
			},
		},
		{
			title: 1,
			_id: 1,
			createdAt: 1,
		},
		{
			populate: {
				path: 'user',
				select: 'username avatar',
			},
		}
	);

	res.status(200).json({
		streams,
	});
};
