<script setup lang="ts">
import type { ResultInterface } from "@/interfaces/result.interface"
import { useResultStore } from "@/stores/result"
import { computed, ref } from "vue"
import { useRouter } from 'vue-router'
import SearchResult from "@/components/SearchResult.vue"

const router = useRouter()
const resultStore = useResultStore()
const searchQuery = ref("")

const search = async () => {
  await resultStore.fetchResults(searchQuery.value)
}

const results = computed(() => resultStore.results)
const loading = computed(() => resultStore.loading)
const error = computed(() => resultStore.error)

const viewDetail = (result: ResultInterface) => {
  resultStore.setSelectedResult(result)
  router.push({
    name: "DetailPage",
    params: { 
      id: result.doc_id
    }
  })
}
</script>

<style>
/* Tailwind CSS included in the main project */
</style>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
    <!-- Search Bar -->
    <div class="flex justify-center mb-6 w-full md:w-1/2">
      <input
        type="text"
        v-model="searchQuery"
        @keyup.enter="search"
        placeholder="Search..."
        class="border rounded-l-lg p-2 w-full focus:outline-none focus:ring focus:border-blue-300"
      />
      <button
        @click="search"
        class="bg-blue-500 text-white rounded-r-lg px-4 hover:bg-blue-600"
      >
        Search
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <p>Loading...</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="text-red-500 text-center">
      <p>{{ error }}</p>
    </div>

    <!-- Search Results -->
    <div v-if="results.length > 0 && !loading" class="mt-6">
      <h3 class="text-lg font-bold mb-4">
        Search Results for "{{ searchQuery }}"
      </h3>
      <SearchResult
        v-for="(result, index) in results"
        :key="index"
        :result="result"
        @view-detail="viewDetail"
      />
    </div>
  </div>
</template>
