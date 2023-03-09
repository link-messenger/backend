import * as yup from 'yup';
import { GROUP_STATUS } from '../constants';

export const createGroupSchema = yup.object({
	body: yup.object({
		name: yup.string().min(1).max(30).required(),
    description: yup.string().optional(),
    status: yup.mixed().oneOf(GROUP_STATUS).optional(),
  }),
});


export const getGroupSchema = yup.object({
  params: yup.object({
    search: yup.string().required(),
  }),
});

export const getGroupDetailSchema = yup.object({
	params: yup.object({
		id: yup.string().required(),
	}),
}); 

export const updateGroupSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
  body: yup.object({
    name: yup.string().min(1).max(30).required(),
    description: yup.string().optional(),
    status: yup.mixed().oneOf(GROUP_STATUS).optional(),
  }),
});


export const deleteGroupSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
});