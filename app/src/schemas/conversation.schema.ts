import * as yup from 'yup';

export const createConversationSchema = yup.object({
	body: yup.object({
		targetUser: yup.string().required()
	}),
});

export const deleteConversationSchema = yup.object({
  params: yup.object({
		id: yup.string().required(),
	}),
});
