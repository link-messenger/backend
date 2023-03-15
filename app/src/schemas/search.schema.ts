import * as yup from 'yup';

export const searchSchema = yup.object({
  query: yup.object({
    name: yup.string().min(3).required(),
  }),
})