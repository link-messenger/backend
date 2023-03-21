import { getMailer } from '../config';

export const sendEmail = async ({to, subject, html}: { to: string; subject: string; html: string }) => {
	const mailer = getMailer();
	const transporter = mailer.getTransporter();
	console.log(mailer.getEmail());
	const mailOptions = {
		from: mailer.getEmail(),
		to,
		subject,
		html,
	};

	await transporter.sendMail(mailOptions);
};
