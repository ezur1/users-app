import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { RandomUser } from '../types/user'
import { useUsersStore } from './users'
import * as api from '../services/backendApi'

vi.mock('../services/backendApi', () => ({
  fetchRandomUsers: vi.fn(),
  fetchSavedUsers: vi.fn(),
  saveUser: vi.fn(),
  updateUserName: vi.fn(),
  deleteUser: vi.fn(),
}))

function makeRandomUser(id: string, first = 'John', last = 'Doe'): RandomUser {
  return {
    login: { uuid: id },
    name: { title: 'Mr', first, last },
    gender: 'male',
    location: {
      street: { number: 1, name: 'Main' },
      city: 'City',
      state: 'State',
      country: 'Canada',
    },
    email: `${id}@example.com`,
    phone: '123',
    picture: { large: '', medium: '', thumbnail: '' },
    dob: { date: '1990-01-01', age: 30 },
  }
}

function createWindowMock(initialStorage: Record<string, string> = {}) {
  const storage = new Map(Object.entries(initialStorage))
  return {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value)
      },
      removeItem: (key: string) => {
        storage.delete(key)
      },
      clear: () => storage.clear(),
    },
  }
}

describe('users store', () => {
  const mockedApi = vi.mocked(api)

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('keeps Modified after saving an edited unsaved user', async () => {
    const user = makeRandomUser('u1', 'John', 'Doe')
    mockedApi.fetchSavedUsers.mockResolvedValueOnce([])
    mockedApi.fetchRandomUsers.mockResolvedValueOnce([user])
    mockedApi.saveUser.mockResolvedValueOnce()
    vi.stubGlobal('window', createWindowMock())

    const store = useUsersStore()
    await store.fetchUsers()
    await store.updateUserName('u1', { title: 'Mr', first: 'Jane', last: 'Doe' })
    await store.saveUser(store.getUserById('u1')!)

    const savedUser = store.getUserById('u1')
    expect(savedUser?.savedInDb).toBe(true)
    expect(savedUser?.modifiedName?.first).toBe('Jane')
  })

  it('hydrates persisted modified names on load', async () => {
    const user = makeRandomUser('u2', 'John', 'Doe')
    mockedApi.fetchSavedUsers.mockResolvedValueOnce([user])
    vi.stubGlobal(
      'window',
      createWindowMock({
        'users-app-modified-names': JSON.stringify({
          u2: { title: 'Mr', first: 'Jane', last: 'Doe' },
        }),
      }),
    )

    const store = useUsersStore()
    await store.loadSavedUsers()

    const loadedUser = store.getUserById('u2')
    expect(loadedUser?.savedInDb).toBe(true)
    expect(loadedUser?.modifiedName?.first).toBe('Jane')
    expect(loadedUser?.name.first).toBe('Jane')
  })
})
