import nodeMailer from 'nodemailer';
import { getEnv } from '../utils';


class NodeMailer {
	private static instance: NodeMailer;
	private user: string;
	private password: string;
	private transporter: nodeMailer.Transporter;

	private constructor() {
		this.user = getEnv('APP_EMAIL_USER');
		this.password = getEnv('APP_EMAIL_PASSWORD');
		this.transporter = nodeMailer.createTransport({
			service: getEnv('APP_EMAIL_SERVICE'),
			auth: {
				user: this.user,
				pass: this.password,
			},
		});
	}

	public static getInstance(): NodeMailer {
		if (!NodeMailer.instance) {
			NodeMailer.instance = new NodeMailer();
		}
		return NodeMailer.instance;
	}

	public getTransporter() {
		return this.transporter;
	}

	public getEmail() {
		return this.user;
	}
}

export const getMailer = NodeMailer.getInstance;
