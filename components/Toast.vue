<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-2 opacity-0"
  >
    <div
      v-if="toastStore.isVisible"
      class="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-white"
      :class="toastStore.type === 'success' ? 'bg-green-500' : 'bg-red-500'"
    >
      {{ toastStore.message }}
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { useToastStore } from '~/stores/toast'

const toastStore = useToastStore()
</script> 