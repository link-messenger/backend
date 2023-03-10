import { Request } from "express";



export const hasUser = (
	request: Request
): request is Request & { user: any  } => {
	return 'user' in request;
}