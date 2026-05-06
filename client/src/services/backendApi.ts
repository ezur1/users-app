import axios from 'axios'
import type { RandomUser, UserName } from '../types/user'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '/api'
const api = axios.create({ baseURL: apiBaseUrl })

export async function fetchRandomUsers(): Promise<RandomUser[]> {
  const { data } = await api.get<RandomUser[]>('/random-users')
  return data
}

export async function fetchSavedUsers(): Promise<RandomUser[]> {
  const { data } = await api.get<RandomUser[]>('/users')
  return data
}

export async function saveUser(user: RandomUser): Promise<void> {
  await api.post('/users', user)
}

export async function updateUserName(id: string, name: UserName): Promise<void> {
  await api.put(`/users/${id}`, { name })
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`)
}
