import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import type { ActivationCode, ListCodesResponse, AddCodesResponse } from '~/types/api'

export const useActivationCodeStore = defineStore('activationCodes', () => {
  const codes = ref<ActivationCode[]>([])
  const currentPage = ref(1)
  const itemsPerPage = 10

  const paginatedCodes = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return codes.value.slice(start, end)
  })

  const totalPages = computed(() =>
    Math.ceil(codes.value.length / itemsPerPage)
  )

  const fetchCodes = async () => {
    try {
      const response = await fetch('/api/list')
      const result = await response.json() as ListCodesResponse

      if (result.success && result.data) {
        codes.value = result.data
      } else {
        console.error('Failed to fetch codes:', result.error)
      }
    } catch (error) {
      console.error('Error fetching codes:', error)
    }
  }

  const generateCodes = async (amount: number) => {
    try {
      const response = await fetch('/api/add', {
        method: 'POST',
        body: JSON.stringify({ amount })
      })
      const result = await response.json() as AddCodesResponse

      if (result.success) {
        // 重新获取所有代码
        await fetchCodes()
      } else {
        console.error('Failed to generate codes:', result.error)
      }
    } catch (error) {
      console.error('Error generating codes:', error)
    }
  }

  const validateCode = async (code: string) => {
    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        body: JSON.stringify({ code })
      })
      const result = await response.json()

      if (result.success) {
        // 重新获取所有代码
        await fetchCodes()
        return true
      }
      console.error('Failed to validate code:', result.error)
      return false
    } catch (error) {
      console.error('Error validating code:', error)
      return false
    }
  }

  const setPage = (page: number) => {
    currentPage.value = page
  }

  // 初始加载时获取代码
  onMounted(() => {
    fetchCodes()
  })

  return {
    codes,
    currentPage,
    paginatedCodes,
    totalPages,
    generateCodes,
    validateCode,
    setPage,
    fetchCodes
  }
})