import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useUserFilter } from './useUserFilter'
import type { AppUser } from '../types/user'

function makeUser(id: string, first: string, country: string, modifiedFirst?: string): AppUser {
  return {
    login: { uuid: id },
    name: { title: 'Mr', first, last: 'Doe' },
    modifiedName: modifiedFirst
      ? { title: 'Mr', first: modifiedFirst, last: 'Doe' }
      : undefined,
    gender: 'male',
    location: {
      street: { number: 1, name: 'Main' },
      city: 'City',
      state: 'State',
      country,
    },
    email: `${id}@example.com`,
    phone: '123',
    picture: { large: '', medium: '', thumbnail: '' },
    dob: { date: '1990-01-01', age: 30 },
    savedInDb: false,
  }
}

describe('useUserFilter', () => {
  it('filters by modified name when present', () => {
    const users = ref<AppUser[]>([
      makeUser('1', 'John', 'Canada', 'Jane'),
      makeUser('2', 'Alex', 'Germany'),
    ])
    const nameFilter = ref('jane')
    const countryFilter = ref('')
    const { filtered } = useUserFilter(users, nameFilter, countryFilter)

    expect(filtered.value).toHaveLength(1)
    expect(filtered.value[0]?.login.uuid).toBe('1')
  })

  it('filters by country and name together', () => {
    const users = ref<AppUser[]>([
      makeUser('1', 'John', 'Canada'),
      makeUser('2', 'John', 'Germany'),
    ])
    const nameFilter = ref('john')
    const countryFilter = ref('canada')
    const { filtered } = useUserFilter(users, nameFilter, countryFilter)

    expect(filtered.value).toHaveLength(1)
    expect(filtered.value[0]?.location.country).toBe('Canada')
  })
})
