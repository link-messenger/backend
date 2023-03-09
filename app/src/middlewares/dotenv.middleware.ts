import  { config } from 'dotenv';

export const dotenv = () => {
	const environment = process.env.NODE_ENV || 'default';
	const path = environment === 'default' ? '.env' : `.env.${environment}`;
	config({
		path,
	});
};
