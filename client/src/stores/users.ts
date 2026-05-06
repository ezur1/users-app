import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppUser, RandomUser, UserName } from '../types/user'
import * as api from '../services/backendApi'

export const useUsersStore = defineStore('users', () => {
  const usersById = ref<Map<string, AppUser>>(new Map())
  const fetchedUserIds = ref<string[]>([])
  const historyUserIds = ref<string[]>([])
  const savedIds = ref<Set<string>>(new Set())
  const modifiedNames = ref<Map<string, UserName>>(new Map())
  const originalNames = ref<Map<string, UserName>>(new Map())
  const loading = ref(false)
  const error = ref<string | null>(null)

  const MODIFIED_NAMES_STORAGE_KEY = 'users-app-modified-names'
  let didHydrateModifiedNames = false

  const fetchedUsers = computed<AppUser[]>(() =>
    fetchedUserIds.value
      .map((id) => usersById.value.get(id))
      .filter((user): user is AppUser => Boolean(user)),
  )

  const historyUsers = computed<AppUser[]>(() =>
    historyUserIds.value
      .map((id) => usersById.value.get(id))
      .filter((user): user is AppUser => Boolean(user)),
  )

  const hasFetchedUsers = computed(() => fetchedUsers.value.length > 0)

  function hydrateModifiedNames() {
    if (didHydrateModifiedNames || typeof window === 'undefined') return
    didHydrateModifiedNames = true
    const raw = window.localStorage.getItem(MODIFIED_NAMES_STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as Record<string, UserName>
      modifiedNames.value = new Map(Object.entries(parsed))
    } catch {
      modifiedNames.value = new Map()
    }
  }

  function persistModifiedNames() {
    if (typeof window === 'undefined') return
    const serialized = JSON.stringify(Object.fromEntries(modifiedNames.value.entries()))
    window.localStorage.setItem(MODIFIED_NAMES_STORAGE_KEY, serialized)
  }

  function isNameModified(id: string, name: UserName): boolean {
    const original = originalNames.value.get(id)
    if (!original) return false
    return original.first !== name.first || original.last !== name.last
  }

  function toAppUser(user: RandomUser, isSaved: boolean): AppUser {
    const id = user.login.uuid
    if (!originalNames.value.has(id)) {
      originalNames.value.set(id, { ...user.name })
    }
    const modifiedName = modifiedNames.value.get(id)
    const effectiveName = modifiedName ?? user.name
    return {
      ...user,
      name: effectiveName,
      savedInDb: isSaved,
      modifiedName,
    }
  }

  function upsertUser(user: AppUser) {
    usersById.value.set(user.login.uuid, user)
  }

  function removeId(list: string[], id: string): string[] {
    return list.filter((currentId) => currentId !== id)
  }

  async function loadSavedUsers() {
    hydrateModifiedNames()
    error.value = null
    try {
      const raw = await api.fetchSavedUsers()
      savedIds.value = new Set(raw.map((u) => u.login.uuid))
      historyUserIds.value = raw.map((u) => u.login.uuid)
      raw.forEach((u) => {
        upsertUser(toAppUser(u, true))
      })

      fetchedUserIds.value.forEach((id) => {
        const user = usersById.value.get(id)
        if (!user) return
        upsertUser({
          ...user,
          savedInDb: savedIds.value.has(id),
          modifiedName: modifiedNames.value.get(id),
        })
      })
    } catch {
      error.value = 'Failed to load saved users'
      throw new Error(error.value)
    }
  }

  async function fetchUsers() {
    hydrateModifiedNames()
    loading.value = true
    error.value = null
    try {
      await loadSavedUsers()
      const raw = await api.fetchRandomUsers()
      fetchedUserIds.value = raw.map((u) => u.login.uuid)
      raw.forEach((u) => upsertUser(toAppUser(u, savedIds.value.has(u.login.uuid))))
    } catch {
      error.value = 'Failed to fetch users'
    } finally {
      loading.value = false
    }
  }

  async function saveUser(user: AppUser) {
    hydrateModifiedNames()
    error.value = null
    try {
      const modified = isNameModified(user.login.uuid, user.name)
      await api.saveUser(user)
      savedIds.value.add(user.login.uuid)
      if (modified) {
        modifiedNames.value.set(user.login.uuid, user.name)
      } else {
        modifiedNames.value.delete(user.login.uuid)
      }
      persistModifiedNames()
      if (!originalNames.value.has(user.login.uuid)) {
        originalNames.value.set(user.login.uuid, { ...user.name })
      }
      patchUser(user.login.uuid, {
        savedInDb: true,
        name: user.name,
        modifiedName: modified ? user.name : undefined,
      })
      historyUserIds.value = [user.login.uuid, ...removeId(historyUserIds.value, user.login.uuid)]
    } catch {
      error.value = 'Failed to save user'
      throw new Error(error.value)
    }
  }

  async function deleteUser(id: string) {
    hydrateModifiedNames()
    error.value = null
    try {
      await api.deleteUser(id)
      savedIds.value.delete(id)
      modifiedNames.value.delete(id)
      persistModifiedNames()
      patchUser(id, { savedInDb: false, modifiedName: undefined })
      historyUserIds.value = removeId(historyUserIds.value, id)
    } catch {
      error.value = 'Failed to delete user'
      throw new Error(error.value)
    }
  }

  async function updateUserName(id: string, name: UserName) {
    hydrateModifiedNames()
    error.value = null
    try {
      const isSaved = savedIds.value.has(id)
      const modified = isNameModified(id, name)

      if (isSaved) {
        await api.updateUserName(id, name)
      }

      if (modified) {
        modifiedNames.value.set(id, name)
      } else {
        modifiedNames.value.delete(id)
      }
      persistModifiedNames()
      patchUser(id, { name, modifiedName: modified ? name : undefined })
    } catch {
      error.value = 'Failed to update user name'
      throw new Error(error.value)
    }
  }

  function patchUser(id: string, patch: Partial<AppUser>) {
    const existing = usersById.value.get(id)
    if (!existing) return
    upsertUser({ ...existing, ...patch })
  }

  function getUserById(id: string): AppUser | undefined {
    return usersById.value.get(id)
  }

  return {
    fetchedUsers,
    historyUsers,
    savedIds,
    loading,
    error,
    hasFetchedUsers,
    fetchUsers,
    loadSavedUsers,
    saveUser,
    deleteUser,
    updateUserName,
    getUserById,
  }
})
