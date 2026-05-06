<template>
  <div class="page-layout detail-page" v-if="user">
    <div class="page-header">
      <Button icon="pi pi-arrow-left" text rounded @click="router.back()" />
      <h2 class="page-title">{{ displayName }} User Details</h2>
      <div class="header-actions">
        <UserDetailsActions
          :saved-in-db="user.savedInDb"
          :saving="saving"
          :deleting="deleting"
          :updating="updating"
          @save="handleSave"
          @delete="handleDelete"
          @update="handleUpdate"
        />
      </div>
    </div>

    <Message v-if="actionMessage" :severity="actionSeverity" class="action-message">
      {{ actionMessage }}
    </Message>

    <div class="mobile-photo">
      <img :src="user.picture.large" :alt="displayName" />
    </div>

    <div class="detail-layout">
      <div class="desktop-photo">
        <img :src="user.picture.large" :alt="displayName" />
      </div>

      <div class="detail-form">
        <section class="form-section">
          <h3 class="section-title">Info</h3>
          <div class="form-grid">
            <div class="field">
              <label>Gender</label>
              <span>{{ capitalize(user.gender) }}</span>
            </div>
            <div class="field">
              <label>Age</label>
              <span>{{ user.dob.age }} yrs (born {{ birthYear }})</span>
            </div>
            <div class="field">
              <label>First name</label>
              <InputText v-model="editFirst" placeholder="First name" />
            </div>
            <div class="field">
              <label>Last name</label>
              <InputText v-model="editLast" placeholder="Last name" />
            </div>
          </div>
        </section>

        <section class="form-section">
          <h3 class="section-title">Address</h3>
          <div class="form-grid">
            <div class="field field--full">
              <label>Street</label>
              <span>{{ user.location.street.number }} {{ user.location.street.name }}</span>
            </div>
            <div class="field">
              <label>City</label>
              <span>{{ user.location.city }}</span>
            </div>
            <div class="field">
              <label>State</label>
              <span>{{ user.location.state }}</span>
            </div>
          </div>
        </section>

        <section class="form-section">
          <h3 class="section-title">Contact</h3>
          <div class="form-grid">
            <div class="field">
              <label>Email</label>
              <span class="field-value--truncate">{{ user.email }}</span>
            </div>
            <div class="field">
              <label>Phone</label>
              <span>{{ user.phone }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>

    <div class="mobile-actions">
      <UserDetailsActions
        :saved-in-db="user.savedInDb"
        :saving="saving"
        :deleting="deleting"
        :updating="updating"
        @save="handleSave"
        @delete="handleDelete"
        @update="handleUpdate"
      />
    </div>

  </div>

  <div v-else class="page-layout not-found">
    <p>User not found.</p>
    <Button label="Go back" icon="pi pi-arrow-left" @click="router.back()" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import UserDetailsActions from '../components/UserDetailsActions.vue'
import { useUsersStore } from '../stores/users'

const props = defineProps<{ id: string; source: 'users' | 'history' }>()
const router = useRouter()
const store = useUsersStore()

const saving = ref(false)
const deleting = ref(false)
const updating = ref(false)
const actionMessage = ref('')
const actionSeverity = ref<'success' | 'error'>('success')

const user = computed(() => store.getUserById(props.id))

const displayName = computed(() => {
  if (!user.value) return ''
  const n = user.value.modifiedName ?? user.value.name
  return `${n.first} ${n.last}`
})

const birthYear = computed(() =>
  user.value ? new Date(user.value.dob.date).getFullYear() : '',
)

const editFirst = ref('')
const editLast = ref('')

onMounted(async () => {
  try {
    if (props.source === 'history' && store.historyUsers.length === 0) {
      await store.loadSavedUsers()
    }
    if (props.source === 'users' && store.fetchedUsers.length === 0) {
      await store.fetchUsers()
    }
  } catch {
    // Error surface is already handled via store.error and action messages.
  }

  if (user.value) {
    const n = user.value.modifiedName ?? user.value.name
    editFirst.value = n.first
    editLast.value = n.last
  }
})

function showMessage(msg: string, severity: 'success' | 'error' = 'success') {
  actionMessage.value = msg
  actionSeverity.value = severity
  setTimeout(() => (actionMessage.value = ''), 3000)
}

async function handleSave() {
  if (!user.value) return
  const first = editFirst.value.trim()
  const last = editLast.value.trim()
  if (!first || !last) {
    showMessage('First and last name are required', 'error')
    return
  }
  saving.value = true
  try {
    const userToSave = {
      ...user.value,
      name: {
        ...user.value.name,
        first,
        last,
      },
    }
    await store.saveUser(userToSave)
    showMessage('User saved successfully!')
  } catch {
    showMessage(store.error ?? 'Failed to save user', 'error')
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!user.value) return
  deleting.value = true
  try {
    await store.deleteUser(props.id)
    showMessage('User deleted')
    setTimeout(() => router.back(), 800)
  } catch {
    showMessage(store.error ?? 'Failed to delete user', 'error')
  } finally {
    deleting.value = false
  }
}

async function handleUpdate() {
  if (!user.value) return
  const first = editFirst.value.trim()
  const last = editLast.value.trim()
  if (!first || !last) {
    showMessage('First and last name are required', 'error')
    return
  }
  updating.value = true
  try {
    await store.updateUserName(props.id, {
      title: user.value.name.title,
      first,
      last,
    })
    showMessage(
      user.value.savedInDb ? 'Name updated in database!' : 'Name updated locally',
    )
  } catch {
    showMessage(store.error ?? 'Failed to update name', 'error')
  } finally {
    updating.value = false
  }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
</script>

<style scoped>
.page-header {
  margin-bottom: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
  flex-shrink: 0;
}

.action-message {
  margin-bottom: 1rem;
}

.mobile-photo {
  display: none;
}

.detail-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.desktop-photo {
  flex-shrink: 0;
}

.desktop-photo img {
  width: 200px;
  height: 200px;
  border-radius: 16px;
  object-fit: cover;
  border: 2px solid var(--p-surface-600);
  display: block;
}

.detail-form {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-section {
  background: var(--p-surface-800);
  border: 1px solid var(--p-surface-700);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  flex-grow: 1;
  width: 100%;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--p-primary-400);
  margin: 0 0 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
}

.field--full {
  grid-column: 1 / -1;
}

.field label {
  font-size: 0.75rem;
  color: var(--p-surface-400);
  font-weight: 500;
}

.field span {
  font-size: 0.9rem;
  color: var(--p-surface-100);
}

.field-value--truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.field :deep(input) {
  width: 100%;
}

.mobile-actions {
  display: none;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding-top: 4rem;
  color: var(--p-surface-400);
}

@media (max-width: 640px) {
  .detail-page {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .desktop-photo {
    display: none;
  }

  .header-actions {
    display: none;
  }

  .mobile-photo {
    display: flex;
    justify-content: center;
    margin-bottom: 1.25rem;
  }

  .mobile-photo img {
    width: 140px;
    height: 140px;
    border-radius: 16px;
    object-fit: cover;
    border: 2px solid var(--p-surface-600);
    display: block;
  }

  .detail-layout {
    flex-direction: column;
    gap: 0;
  }

  .detail-form {
    width: 100%;
    gap: 1rem;
  }

  .form-section {
    border-radius: 12px;
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .field--full {
    grid-column: 1;
  }

  .mobile-actions {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 1.5rem;
    padding-bottom: 1rem;
  }
}
</style>
