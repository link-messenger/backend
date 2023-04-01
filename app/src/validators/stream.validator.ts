import * as yup from 'yup';

export const createStreamSchema = yup.object({
  body: yup.object({
    title: yup.string().min(3).required(),
  }),
})
export const getUserStreamsSchema = yup.object({
  params: yup.object({
    username: yup.string().required(),
  })
});
export const getOnlineStreamSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  })
})