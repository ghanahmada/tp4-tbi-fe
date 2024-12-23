<template>
  <!-- Header -->
  <header class="w-full h-[67px] bg-[#EAEAEA] flex items-center px-6 md:px-12 lg:px-20 fixed top-0 left-0 z-10">
    <!-- Logo Fasilkom -->
    <div class="flex items-center w-full md:w-[334px] h-[57px] flex-shrink-0 gap-4">
      <!-- Logo Image -->
      <img
        src="https://i.ibb.co/4WF64VD/Fasilkom-UI-Logo-1.png"
        alt="Fasilkom UI Logo"
        class="w-[40px] h-[40px] object-cover"
      />
      <!-- Text Logo -->
      <div class="w-full md:w-[263px] flex-shrink-0">
        <!-- Title -->
        <div class="text-[16px] md:text-[20px] font-bold text-black leading-none capitalize pb-1">
          Information Retrieval
        </div>
        <!-- Subtitle -->
        <div class="text-[10px] md:text-[12px] font-light text-black leading-none capitalize">
          fasilkom UI
        </div>
      </div>
    </div>
  </header>

  <!-- Content Section -->
  <div class="container mx-auto p-4 pt-[100px] pb-[90px]">
    <!-- Result Content -->
    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">{{ result?.title }}</h2>
      <p class="text-gray-700" v-html="formattedDesc"></p>
    </div>
    <button
      @click="goBack"
      class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
    >
      Back to Search
    </button>
  </div>

  <footer class="w-full h-[60px] bg-[#EAEAEA] flex items-center px-6 md:px-12 lg:px-20 fixed bottom-0 left-0 z-10">
      <div class="w-full flex-shrink-0">
        <!-- Title -->
        <div class="text-[12px] md:text-[12px] font-LIGHT text-black leading-none capitalize pb-1">
          Result are not personalized
        </div>
        <div class="text-[8px] md:text-[8px] font-LIGHT text-black leading-none capitalize pb-1">
          © 2024 Information Retrieval - Faculty of Computer Science
        </div>
      </div>
  </footer>
</template>

<script setup lang="ts">
import { useResultStore } from '@/stores/result'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const resultStore = useResultStore()
const result = computed(() => resultStore.selectedResult)

const formattedDesc = computed(() => {
  return result.value?.desc?.replace(/\n/g, "<br>") || ""
})

onMounted(() => {
  if (!resultStore.selectedResult) {
    router.push('/')
  }
})

const goBack = () => {
  router.push({
    name: "PaginatedResultPage", // Ensure this matches your route name
    query: {
      search: route.query.search,
      method: route.query.method,
      retrievalTime: route.query.retrievalTime,
    },
  })
}
</script>
