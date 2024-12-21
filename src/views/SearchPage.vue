<script setup lang="ts">
import type { ResultInterface } from "@/interfaces/result.interface"
import { useResultStore } from "@/stores/result"
import { computed, ref } from "vue"
import { useRouter } from 'vue-router'
import SearchResult from "@/components/SearchResult.vue"

const router = useRouter()
const resultStore = useResultStore()
const searchQuery = ref("")
const method = ref("BM25")
const results = computed(() => resultStore.results)
const loading = computed(() => resultStore.loading)
const error = computed(() => resultStore.error)
const retrievalTime = ref<number | null>(null)

const search = async () => {
  const startTime = performance.now()
  await resultStore.fetchResults(searchQuery.value, method.value)
  const endTime = performance.now()
  retrievalTime.value = ((endTime - startTime) / 1000)
}


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
      <select
        v-model="method"
        class="border rounded-l-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="BM25">BM25</option>
        <option value="ColBERT">ColBERT</option>
        <option value="BERT">BERT</option>
      </select>
      <input
        type="text"
        v-model="searchQuery"
        @keyup.enter="search"
        placeholder="Search..."
        class="border p-2 w-full focus:outline-none focus:ring focus:border-blue-300"
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
        <span v-if="retrievalTime !== null">
          ({{ results.length }} results in {{ retrievalTime.toFixed(2) }}s)
        </span>
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
