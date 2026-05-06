<template>
  <div class="user-card" @click="emit('click', user)">
    <div class="user-card__avatar">
      <img :src="user.picture.thumbnail" :alt="displayName" />
    </div>
    <div class="user-card__body">
      <div class="user-card__name">{{ displayName }}</div>
      <div class="user-card__meta">
        <span class="meta-item">
          <i class="pi pi-venus-mars" />
          {{ capitalize(user.gender) }}
        </span>
        <span class="meta-item">
          <i class="pi pi-map-marker" />
          {{ user.location.country }}
        </span>
        <span class="meta-item meta-item--phone">
          <i class="pi pi-phone" />
          {{ user.phone }}
        </span>
        <span class="meta-item meta-item--email">
          <i class="pi pi-envelope" />
          {{ user.email }}
        </span>
      </div>
    </div>
    <div class="user-card__badges">
      <Tag v-if="user.savedInDb" value="Saved" severity="success" />
      <Tag v-if="user.modifiedName" value="Modified" severity="warn" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag'
import type { AppUser } from '../types/user'
import { computed } from 'vue'

const props = defineProps<{ user: AppUser }>()
const emit = defineEmits<{ click: [user: AppUser] }>()

const displayName = computed(() => {
  const n = props.user.modifiedName ?? props.user.name
  return `${n.title} ${n.first} ${n.last}`
})

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--p-surface-800);
  border: 1px solid var(--p-surface-700);
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  min-width: 0;
}

.user-card:hover {
  border-color: var(--p-primary-400);
  background: var(--p-surface-700);
}

.user-card__avatar img {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--p-surface-600);
  flex-shrink: 0;
}

.user-card__body {
  flex: 1;
  min-width: 0;
}

.user-card__name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--p-surface-0);
  margin-bottom: 0.4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem;
  font-size: 0.8rem;
  color: var(--p-surface-300);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
}

.meta-item .pi {
  font-size: 0.75rem;
  color: var(--p-primary-400);
  flex-shrink: 0;
}

.user-card__badges {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  align-items: flex-end;
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .user-card {
    padding: 0.75rem 1rem;
    gap: 0.75rem;
  }

  .meta-item--phone,
  .meta-item--email {
    display: none;
  }
}
</style>
