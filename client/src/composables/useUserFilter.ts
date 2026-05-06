import { computed, type Ref } from 'vue'
import type { AppUser } from '../types/user'

export function useUserFilter(
  users: Ref<AppUser[]>,
  nameFilter: Ref<string>,
  countryFilter: Ref<string>,
) {
  const filtered = computed(() => {
    const name = nameFilter.value.trim().toLowerCase()
    const country = countryFilter.value.trim().toLowerCase()

    return users.value.filter((u) => {
      const effectiveName = u.modifiedName ?? u.name
      const fullName =
        `${effectiveName.title} ${effectiveName.first} ${effectiveName.last}`.toLowerCase()
      const matchesName = !name || fullName.includes(name)
      const matchesCountry = !country || u.location.country.toLowerCase().includes(country)
      return matchesName && matchesCountry
    })
  })

  return { filtered }
}
