<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Activation Code Management</h1>

    <!-- Generate Codes Section -->
    <div class="mb-8">
      <div class="flex gap-4 items-center">
        <input v-model="amount" type="number" min="1" max="100" class="px-4 py-2 border rounded-lg"
          placeholder="Number of codes" />
        <button @click="generateCodes"
          class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Generate Codes
        </button>
      </div>
    </div>

    <!-- Codes Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="code in store.paginatedCodes" :key="code.code">
            <td class="px-6 py-4 whitespace-nowrap">{{ code.code }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ new Date(code.createdAt).toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="!code ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ !code ? 'Used' : 'Available' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap flex gap-4">
              <button @click="copyCode(code.code)" class="text-blue-600 hover:text-blue-900">
                Copy
              </button>
              <button @click="validateCode(code.code)" class="text-red-600 hover:text-red-900">
                Use
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-center gap-2">
      <button v-for="page in store.totalPages" :key="page" @click="store.setPage(page)" :class="[
        'px-4 py-2 rounded',
        store.currentPage === page
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 hover:bg-gray-300'
      ]">
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const store = useActivationCodeStore()
const amount = ref(10)

const generateCodes = () => {
  store.generateCodes(amount.value)
}

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code)
  } catch (err) {
    alert('Failed to copy code')
  }
}

const validateCode = async (code: string) => {
  store.validateCode(code)
}
</script>
