import * as yup from 'yup';

export const lastMessagesSchema = yup.object({
	params: yup.object({
		id: yup.string().required(),
		type: yup.mixed().oneOf(['group', 'user']).required(),
	}),
	query: yup.object({
		page: yup.number().optional(),
	}),
});
