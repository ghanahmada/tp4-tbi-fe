<script setup lang="ts">
import { useResultStore } from "@/stores/result"
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router";

const router = useRouter();
const resultStore = useResultStore()
const searchQuery = ref("")
const method = ref("BM25")
const loading = computed(() => resultStore.loading)
const error = computed(() => resultStore.error)
const retrievalTime = ref<number | null>(null)

const methodList = ref<string[]>([])

const getMethods = async () => {
  methodList.value = await resultStore.fetchFeatureList()
}

const search = async () => {
  const startTime = performance.now();
  await resultStore.fetchResults(searchQuery.value, method.value);
  const endTime = performance.now();
  retrievalTime.value = (endTime - startTime) / 1000;

  // Redirect to PaginatedResultPage after the search
  router.push({
    name: "PaginatedResultPage", // Ensure this matches your route name
    query: {
      search: searchQuery.value,
      method: method.value,
      retrievalTime: retrievalTime.value,
    },
  });
};

onMounted(() => {
  getMethods()
})
</script>

<style>
/* Tailwind CSS included in the main project */
</style>

<template>
  <div class="min-h-screen flex flex-col items-center bg-gray-100">
    <!-- Header -->
    <header class="w-full h-[100px] bg-[#EAEAEA] flex items-center px-6 md:px-12 lg:px-20 fixed top-0 left-0 z-10">
      <!-- Logo Fasilkom -->
      <div class="flex items-center w-full md:w-[334px] h-[57px] flex-shrink-0 gap-4">
        <!-- Logo Image -->
        <img
          src="https://i.ibb.co/4WF64VD/Fasilkom-UI-Logo-1.png"
          alt="Fasilkom UI Logo"
          class="w-[58px] h-[57px] object-cover"
        />
        <!-- Text Logo -->
        <div class="w-full md:w-[263px] flex-shrink-0">
          <!-- Title -->
          <div class="text-[16px] md:text-[24px] font-bold text-black leading-none capitalize pb-1">
            Information Retrieval
          </div>
          <!-- Subtitle -->
          <div class="text-[10px] md:text-[16px] font-light text-black leading-none capitalize">
            fasilkom UI
          </div>
        </div>
      </div>
    </header>

    <!-- Search Bar -->
    <div class="flex justify-center w-full md:w-3/5 pt-[43vh]">
      <select
        v-model="method"
        class="border rounded-l-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
      >
        <option
          v-for="(item, idx) in methodList"
          :key="idx"
          :value="item"
        >
          {{ item }}
        </option>
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
    </div> <!-- Close the missing div tag here -->

    <!-- Loading State -->
    <div v-if="loading" class="text-center mt-[140px]">
      <p>Loading...</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="text-red-500 text-center">
      <p>{{ error }}</p>
    </div>

    <footer class="w-full h-[80px] bg-[#EAEAEA] flex items-center px-6 md:px-12 lg:px-20 fixed bottom-0 left-0 z-10">
      <div class="w-full flex-shrink-0">
          <!-- Title -->
          <div class="text-[16px] md:text-[16px] font-LIGHT text-black leading-none capitalize pb-1">
            Result are not personalized
          </div>
          <div class="text-[10px] md:text-[12px] font-LIGHT text-black leading-none capitalize pb-1">
            © 2024 Information Retrieval - Faculty of Computer Science
          </div>
        </div>
    </footer>
  </div>
</template>
