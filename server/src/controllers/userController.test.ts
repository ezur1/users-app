import type { Request, Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  deleteUser,
  getRandomUsers,
  saveUser,
  updateUserName,
} from './userController'
import { HttpError } from '../middleware/error'

const { prismaMock, axiosGetMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
  axiosGetMock: vi.fn(),
}))

vi.mock('../db/prisma', () => ({
  default: prismaMock,
}))

vi.mock('axios', () => ({
  default: {
    get: axiosGetMock,
  },
}))

function createResponse(): Response {
  const res = {} as Response
  res.json = vi.fn().mockReturnValue(res)
  res.status = vi.fn().mockReturnValue(res)
  res.send = vi.fn().mockReturnValue(res)
  return res
}

describe('userController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getRandomUsers returns mapped random users', async () => {
    axiosGetMock.mockResolvedValueOnce({ data: { results: [{ login: { uuid: '1' } }] } })
    const res = createResponse()

    await getRandomUsers({} as Request, res)

    expect(res.json).toHaveBeenCalledWith([{ login: { uuid: '1' } }])
  })

  it('saveUser creates a user when payload is valid', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null)
    const req = {
      body: {
        login: { uuid: 'u1' },
        name: { title: 'Mr', first: 'John', last: 'Doe' },
      },
    } as Request
    const res = createResponse()

    await saveUser(req, res)

    expect(prismaMock.user.create).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it('saveUser throws 400 for invalid payload', async () => {
    const req = { body: { login: {} } } as Request
    const res = createResponse()

    await expect(saveUser(req, res)).rejects.toBeInstanceOf(HttpError)
  })

  it('updateUserName updates existing saved user', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'u1',
      data: JSON.stringify({
        login: { uuid: 'u1' },
        name: { title: 'Mr', first: 'Old', last: 'Name' },
      }),
    })
    const req = {
      params: { id: 'u1' },
      body: { name: { title: 'Mr', first: 'New', last: 'Name' } },
    } as unknown as Request
    const res = createResponse()

    await updateUserName(req, res)

    expect(prismaMock.user.update).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith({ id: 'u1' })
  })

  it('deleteUser throws 404 for missing user', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null)
    const req = { params: { id: 'missing' } } as unknown as Request
    const res = createResponse()

    await expect(deleteUser(req, res)).rejects.toBeInstanceOf(HttpError)
  })
})
