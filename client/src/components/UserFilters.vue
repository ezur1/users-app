<template>
  <div class="filters">
    <IconField class="filter-field">
      <InputIcon class="pi pi-user" />
      <InputText v-model="name" placeholder="Filter by name..." />
    </IconField>
    <IconField class="filter-field">
      <InputIcon class="pi pi-map-marker" />
      <InputText v-model="country" placeholder="Filter by country..." />
    </IconField>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

const name = defineModel<string>('name', { default: '' })
const country = defineModel<string>('country', { default: '' })
</script>

<style scoped>
.filters {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-shrink: 0;
  margin-bottom: 1.25rem;
}

.filter-field {
  flex: 1;
}

.filter-field :deep(input) {
  width: 100%;
}
</style>
