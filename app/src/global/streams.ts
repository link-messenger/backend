import NodeMediaServer from 'node-media-server';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { getEnv } from '../utils';

type Stream = {
	id: string;
	status: 'active' | 'deactive';
};

class ActiveStreams {
	private static instance: ActiveStreams;
	private streams: Map<string, Stream>;

	private constructor() {
		this.streams = new Map();
	}

	public static getInstance() {
		if (!this.instance) {
			this.instance = new ActiveStreams();
		}
		return this.instance;
	}

	public add(key: string, stream: Stream) {
		this.streams.set(key, stream);
	}

	public remove(key: string) {
		this.streams.delete(key);
	}

	public find(key: string) {
		return this.streams.has(key);
	}

	public getStream(key: string) {
		return this.streams.get(key);
	}

	public getCount() {
		return this.streams.size;
	}

	public getOnlineKeys() {
		const keys: string[] = [];
		this.streams.forEach((value, key) => {
			if (value.status === 'active') {
				keys.push(key);
			}
		});

		return keys;
	}

	public clear() {
		this.streams.clear();
	}
}

export const activeStreams = ActiveStreams.getInstance();

export class StreamServer {
	private static instance: StreamServer;
	private nms: NodeMediaServer;
	private constructor() {
		this.nms = new NodeMediaServer({
			rtmp: {
				port: 1935,
				chunk_size: 60000,
				gop_cache: true,
				ping: 30,
				ping_timeout: 60,
			},
			http: {
				port: 8000,
				// change to minio
				mediaroot: './media',
				allow_origin: '*',
			},
			trans: {
				ffmpeg: ffmpegPath,
				tasks: [
					{
						app: 'live',
						hls: true,
						hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
						dash: true,
						dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
					},
				],
			},
			auth: {
				// @ts-expect-error
				api: true,
				api_user: getEnv('APP_STREAM_USER'),
				api_pass: getEnv('APP_STREAM_PASS'),
			},
			logType: 2,
		});
	}

	public static getInstance() {
		if (!this.instance) {
			this.instance = new StreamServer();
		}
		return this.instance;
	}

	public run() {
		return this.nms.run();
	}

	public getServer() {
		return this.nms;
	}
}
