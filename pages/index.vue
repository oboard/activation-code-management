<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">激活码管理系统</h1>
      <button @click="logout" class="text-red-600 hover:text-red-800 px-4 py-2 rounded">
        退出登录
      </button>
    </div>

    <!-- Generate Codes Section -->
    <div class="mb-8">
      <div class="flex gap-4 items-center">
        <input
          v-model="amount"
          type="number"
          min="1"
          max="100"
          class="px-4 py-2 border rounded-lg w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="生成数量"
        />
        <button 
          @click="generateCodes"
          class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          生成激活码
        </button>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="store.hasSelectedCodes" class="mb-4 flex gap-4">
      <button 
        @click="copySelectedAsMarkdown" 
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
      >
        复制选中项为 Markdown
      </button>
      <button 
        @click="store.unselectAll" 
        class="text-gray-600 hover:text-gray-800 px-4 py-2 rounded"
      >
        取消选择
      </button>
    </div>

    <!-- Codes Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-10 px-6 py-3">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="() => toggleSelectAll(!isAllSelected)"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              激活码
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              创建时间
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              剩余次数
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="code in store.paginatedCodes" :key="code.code">
            <td class="px-6 py-4">
              <input
                type="checkbox"
                :checked="store.selectedCodes.has(code.code)"
                @change="() => store.toggleSelect(code.code)"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap font-mono">
              {{ code.code }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">
              {{ new Date(code.createdAt).toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="code.remainingUses > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ code.remainingUses }}次
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex gap-2">
                <button 
                  @click="copyCode(code.code)"
                  class="text-blue-600 hover:text-blue-900 px-3 py-1 rounded"
                >
                  复制
                </button>
                <button 
                  v-if="code.remainingUses > 0"
                  @click="validateCode(code.code)"
                  class="text-red-600 hover:text-red-900 px-3 py-1 rounded"
                >
                  使用
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-center gap-2">
      <button
        v-for="page in store.totalPages"
        :key="page"
        @click="store.setPage(page)"
        :class="[
          'px-4 py-2 rounded transition-colors',
          store.currentPage === page
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 hover:bg-gray-300'
        ]"
      >
        {{ page }}
      </button>
    </div>

    <Toast />
  </div>
</template>

<script lang="ts" setup>
import { useToastStore } from '~/stores/toast'

definePageMeta({
  middleware: ['auth']
})

const router = useRouter()
const store = useActivationCodeStore()
const toast = useToastStore()
const amount = ref<number>(10)

const generateCodes = async () => {
  await store.generateCodes(amount.value)
  toast.show('激活码生成成功')
}

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code)
    toast.show('复制成功')
  } catch (err) {
    toast.show('复制失败', 'error')
  }
}

const copySelectedAsMarkdown = async () => {
  try {
    const markdown = store.getSelectedCodesMarkdown()
    await navigator.clipboard.writeText(markdown)
    toast.show('已复制选中项为 Markdown 格式')
  } catch (err) {
    toast.show('复制失败', 'error')
  }
}

const validateCode = async (code: string) => {
  const success = await store.validateCode(code)
  if (success) {
    toast.show('激活码使用成功')
  } else {
    toast.show('激活码使用失败', 'error')
  }
}

const isAllSelected = computed(() => {
  const currentPageCodes = store.paginatedCodes
  return currentPageCodes.length > 0 && currentPageCodes.every(code => store.selectedCodes.has(code.code))
})

const toggleSelectAll = (checked: boolean) => {
  if (checked) {
    store.selectAll()
  } else {
    store.unselectAll()
  }
}

const logout = () => {
  localStorage.removeItem('isLoggedIn')
  router.push('/login')
}
</script>
