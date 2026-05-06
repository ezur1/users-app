<template>
  <div class="page-layout list-page">
    <div class="page-header">
      <Button icon="pi pi-arrow-left" text rounded @click="router.push('/')" />
      <h2 class="page-title">Users</h2>
      <span class="page-count">{{ filtered.length }} / {{ store.fetchedUsers.length }}</span>
    </div>

    <UserFilters v-model:name="nameFilter" v-model:country="countryFilter" />
    <Message v-if="store.error" severity="error" class="mb-3">{{ store.error }}</Message>

    <div class="scroll-area">
      <UserList
        :users="filtered"
        empty-message="No users match your filters"
        @select="goToDetail"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Message from 'primevue/message'
import UserFilters from '../components/UserFilters.vue'
import UserList from '../components/UserList.vue'
import { useUsersStore } from '../stores/users'
import { useUserFilter } from '../composables/useUserFilter'
import type { AppUser } from '../types/user'

const router = useRouter()
const store = useUsersStore()
const { fetchedUsers } = storeToRefs(store)

const nameFilter = ref('')
const countryFilter = ref('')

const { filtered } = useUserFilter(fetchedUsers, nameFilter, countryFilter)

function goToDetail(user: AppUser) {
  router.push(`/users/${user.login.uuid}`)
}
</script>

<style scoped>
.list-page {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: 2px;
}
</style>
