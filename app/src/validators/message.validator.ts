import * as yup from 'yup';

export const lastMessagesSchema = yup.object({
	params: yup.object({
		id: yup.string().required(),
	}),
	query: yup.object({
		page: yup.number().optional(),
	}),
});
