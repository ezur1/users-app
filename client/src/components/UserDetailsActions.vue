<template>
  <Button
    v-if="!savedInDb"
    label="Save"
    icon="pi pi-bookmark"
    severity="success"
    :loading="saving"
    @click="emit('save')"
  />
  <Button
    v-else
    label="Delete"
    icon="pi pi-trash"
    severity="danger"
    :loading="deleting"
    @click="emit('delete')"
  />
  <Button
    label="Update"
    icon="pi pi-pencil"
    severity="secondary"
    :loading="updating"
    @click="emit('update')"
  />
</template>

<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  savedInDb: boolean
  saving: boolean
  deleting: boolean
  updating: boolean
}>()

const emit = defineEmits<{
  save: []
  delete: []
  update: []
}>()
</script>
