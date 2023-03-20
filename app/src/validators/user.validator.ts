import * as yup from 'yup';

export const userProfileSchema = yup.object({
	params: yup.object({
		id: yup.string().required(),
	}),
});
