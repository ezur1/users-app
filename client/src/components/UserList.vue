<template>
  <div v-if="users.length === 0" class="empty-state">
    <i class="pi pi-users" style="font-size: 2.5rem; opacity: 0.3" />
    <p>{{ emptyMessage }}</p>
  </div>
  <div v-else class="user-list">
    <UserCard
      v-for="user in users"
      :key="user.login.uuid"
      :user="user"
      @click="emit('select', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import UserCard from './UserCard.vue'
import type { AppUser } from '../types/user'

withDefaults(
  defineProps<{
    users: AppUser[]
    emptyMessage?: string
  }>(),
  {
    emptyMessage: 'No users found',
  },
)

const emit = defineEmits<{ select: [user: AppUser] }>()
</script>

<style scoped>
.user-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 0;
  color: var(--p-surface-400);
  font-size: 0.95rem;
}
</style>
