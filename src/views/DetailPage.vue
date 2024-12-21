<template>
  <div class="container mx-auto p-4">
    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">{{ result?.title }}</h2>
      <p class="text-gray-700">{{ result?.desc }}</p>
    </div>
    <button
      @click="goBack"
      class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
    >
      Back to Search
    </button>
  </div>
</template>

<script setup lang="ts">
import { useResultStore } from '@/stores/result'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const resultStore = useResultStore()
const result = computed(() => resultStore.selectedResult)

onMounted(() => {
  if (!resultStore.selectedResult) {
    router.push('/')
  }
})

const goBack = () => {
  router.push('/')
}
</script>