<template>
  <div class="home-page">
    <div class="home-page__hero">
      <i class="pi pi-users home-page__icon" />
      <h1 class="home-page__title">Users App</h1>
      <p class="home-page__subtitle">Browse random people or view your saved history</p>
    </div>

    <div class="home-page__actions">
      <Button
        label="Fetch Users"
        icon="pi pi-refresh"
        size="large"
        :loading="store.loading"
        @click="handleFetch"
      />
      <Button
        label="History"
        icon="pi pi-history"
        size="large"
        severity="secondary"
        @click="router.push('/history')"
      />
    </div>

    <Message v-if="store.error" severity="error" class="mt-4">{{ store.error }}</Message>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useUsersStore } from '../stores/users'

const router = useRouter()
const store = useUsersStore()

async function handleFetch() {
  await store.fetchUsers()
  if (!store.error) router.push('/users')
}
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  gap: 2.5rem;
  text-align: center;
}

.home-page__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.home-page__icon {
  font-size: 3.5rem;
  color: var(--p-primary-400);
}

.home-page__title {
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--p-surface-0);
}

.home-page__subtitle {
  font-size: 1rem;
  color: var(--p-surface-400);
  margin: 0;
}

.home-page__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
