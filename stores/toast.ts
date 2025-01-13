import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const isVisible = ref(false)
  const message = ref('')
  const type = ref<'success' | 'error'>('success')
  let timeoutId: NodeJS.Timeout | null = null

  const show = (msg: string, msgType: 'success' | 'error' = 'success') => {
    message.value = msg
    type.value = msgType
    isVisible.value = true

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      isVisible.value = false
    }, 3000)
  }

  return {
    isVisible,
    message,
    type,
    show
  }
}) 