<template>
  <div class="page-layout list-page">
    <div class="page-header">
      <Button icon="pi pi-arrow-left" text rounded @click="router.push('/')" />
      <h2 class="page-title">History</h2>
      <span class="page-count">{{ filtered.length }} / {{ store.historyUsers.length }}</span>
    </div>

    <UserFilters v-model:name="nameFilter" v-model:country="countryFilter" />
    <Message v-if="store.error" severity="error" class="mb-3">{{ store.error }}</Message>

    <div class="scroll-area">
      <div v-if="store.loading" class="loading-state">
        <ProgressSpinner style="width: 40px; height: 40px" />
      </div>
      <UserList
        v-else
        :users="filtered"
        empty-message="No saved users yet — save some from the Users page"
        @select="goToDetail"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import UserFilters from '../components/UserFilters.vue'
import UserList from '../components/UserList.vue'
import { useUsersStore } from '../stores/users'
import { useUserFilter } from '../composables/useUserFilter'
import type { AppUser } from '../types/user'

const router = useRouter()
const store = useUsersStore()
const { historyUsers } = storeToRefs(store)

const nameFilter = ref('')
const countryFilter = ref('')

const { filtered } = useUserFilter(historyUsers, nameFilter, countryFilter)

onMounted(() => store.loadSavedUsers())

function goToDetail(user: AppUser) {
  router.push(`/history/${user.login.uuid}`)
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

.loading-state {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}
</style>
