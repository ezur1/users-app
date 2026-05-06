import { Request, Response } from 'express'
import axios from 'axios'
import prisma from '../db/prisma'
import { HttpError } from '../middleware/error'
import { saveUserSchema, updateUserNameSchema } from '../validation/userSchemas'

export async function getRandomUsers(_req: Request, res: Response): Promise<void> {
  try {
    const { data } = await axios.get('https://randomuser.me/api/?results=10')
    res.json(data.results)
  } catch {
    throw new HttpError(502, 'Failed to fetch users from randomuser API')
  }
}

export async function getSavedUsers(_req: Request, res: Response): Promise<void> {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  const parsedUsers = users.map((u) => {
    try {
      return JSON.parse(u.data)
    } catch {
      throw new HttpError(500, `Corrupted saved user payload for id ${u.id}`)
    }
  })
  res.json(parsedUsers)
}

export async function saveUser(req: Request, res: Response): Promise<void> {
  const parsedPayload = saveUserSchema.safeParse(req.body)
  if (!parsedPayload.success) {
    throw new HttpError(400, 'Invalid user payload')
  }
  const user = req.body
  const id = parsedPayload.data.login.uuid

  const existing = await prisma.user.findUnique({ where: { id } })
  if (existing) {
    throw new HttpError(409, 'User already saved')
  }

  await prisma.user.create({
    data: {
      id,
      data: JSON.stringify(user),
      firstName: user.name.first,
      lastName: user.name.last,
    },
  })

  res.status(201).json({ id })
}

export async function updateUserName(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string
  const parsedPayload = updateUserNameSchema.safeParse(req.body)

  if (!parsedPayload.success) {
    throw new HttpError(400, 'name.title, name.first and name.last are required')
  }
  const { name } = parsedPayload.data

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) {
    throw new HttpError(404, 'User not found')
  }

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(existing.data) as Record<string, unknown>
  } catch {
    throw new HttpError(500, `Corrupted saved user payload for id ${id}`)
  }
  const existingName =
    typeof parsed.name === 'object' && parsed.name !== null
      ? (parsed.name as Record<string, unknown>)
      : {}
  parsed.name = { ...existingName, ...name }

  await prisma.user.update({
    where: { id },
    data: {
      firstName: name.first,
      lastName: name.last,
      data: JSON.stringify(parsed),
    },
  })

  res.json({ id })
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) {
    throw new HttpError(404, 'User not found')
  }

  await prisma.user.delete({ where: { id } })
  res.status(204).send()
}
