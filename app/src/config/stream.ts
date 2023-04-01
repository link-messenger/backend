import { activeStreams, StreamServer } from '../global';
import { getStreamKey } from '../utils';

export const configStream = () => {
	const server = StreamServer.getInstance().getServer();

	server.on('prePublish', async (id, streamPath, args) => {
		const session = server.getSession(id);
		const key = getStreamKey(streamPath);
		if (!key) {
			// @ts-expect-error
			return session.reject();
		}
		const stream = activeStreams.getStream(key);
		if (!stream || stream.status === 'active') {
			// @ts-expect-error
			return session.reject();
		}

		activeStreams.add(key, {
			id: stream.id,
			status: 'active',
		});
		console.log(
			`[NodeEvent on prePublish] stream with id=${stream.id} and key=${key} has started`
		);
	});

	server.on('donePublish', (id, streamPath, args) => {
    const key = getStreamKey(streamPath) as string;
    activeStreams.remove(key);
    console.log(
			`[NodeEvent on prePublish] key=${key} has been destroyed`
		);
	});
};
