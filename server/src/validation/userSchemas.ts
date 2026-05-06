import { z } from 'zod'

const userNameSchema = z.object({
  title: z.string().min(1),
  first: z.string().min(1),
  last: z.string().min(1),
})

export const saveUserSchema = z.object({
  login: z.object({
    uuid: z.string().min(1),
  }),
  name: userNameSchema,
})

export const updateUserNameSchema = z.object({
  name: userNameSchema,
})
