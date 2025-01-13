import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import type { ActivationCode, ListCodesResponse, AddCodesResponse } from '~/types/api'

export const useActivationCodeStore = defineStore('activationCodes', () => {
  const codes = ref<ActivationCode[]>([])
  const currentPage = ref(1)
  const itemsPerPage = 10
  const selectedCodes = ref<Set<string>>(new Set())

  const paginatedCodes = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return codes.value.slice(start, end)
  })

  const totalPages = computed(() =>
    Math.ceil(codes.value.length / itemsPerPage)
  )

  const hasSelectedCodes = computed(() => selectedCodes.value.size > 0)

  const toggleSelect = (code: string) => {
    if (selectedCodes.value.has(code)) {
      selectedCodes.value.delete(code)
    } else {
      selectedCodes.value.add(code)
    }
  }

  const selectAll = () => {
    for (const code of paginatedCodes.value) {
      selectedCodes.value.add(code.code)
    }
  }

  const unselectAll = () => {
    selectedCodes.value.clear()
  }

  const getSelectedCodesMarkdown = () => {
    const selectedItems = codes.value.filter(code => selectedCodes.value.has(code.code))

    return selectedItems.map((code, index) => `${index + 1}: ${code.code}`).join('\n')
  }

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
        selectedCodes.value.delete(code)
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
    selectedCodes,
    hasSelectedCodes,
    toggleSelect,
    selectAll,
    unselectAll,
    getSelectedCodesMarkdown,
    generateCodes,
    validateCode,
    setPage,
    fetchCodes
  }
})