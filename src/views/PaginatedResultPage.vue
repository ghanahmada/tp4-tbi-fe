<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useResultStore } from "@/stores/result";
import { useRouter } from "vue-router";
import type { ResultInterface } from "@/interfaces/result.interface";
import SearchResult from "@/components/SearchResult.vue";

const router = useRouter();
const resultStore = useResultStore();
const searchQuery = ref("");
const method = ref("BM25");
const results = computed(() => resultStore.results);
const loading = computed(() => resultStore.loading);
const error = computed(() => resultStore.error);
const retrievalTime = ref<number | null>(null);

const methodList = ref<string[]>([]);

// Pagination logic
const itemsPerPage = 5; // Number of results per page
const currentPage = ref(1);

// Get the list of methods
const getMethods = async () => {
  methodList.value = await resultStore.fetchFeatureList();
};

// Search function
const search = async () => {
  const startTime = performance.now();
  await resultStore.fetchResults(searchQuery.value, method.value);
  const endTime = performance.now();
  retrievalTime.value = (endTime - startTime) / 1000;
};

// View details of a result
const viewDetail = (result: ResultInterface) => {
  resultStore.setSelectedResult(result);
  router.push({
    name: "DetailPage",
    params: {
      id: result.doc_id,
    },
  });
};

// Pagination logic
const totalPages = computed(() => Math.ceil(results.value.length / itemsPerPage));

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return results.value.slice(start, end);
});

// Determine pages to display
const pagesToShow = computed(() => {
  const pages = [];
  const range = 0; // Number of pages to show before and after the current page
  const start = Math.max(1, currentPage.value - range);
  const end = Math.min(totalPages.value, currentPage.value + range);

  if (currentPage.value > range + 1) pages.push(1); // Ellipsis before range
  if (currentPage.value > range + 2) pages.push("..."); // Ellipsis before range
  for (let i = start; i <= end; i++) pages.push(i);
  if (currentPage.value < totalPages.value - range - 1) pages.push("..."); // Ellipsis after range
  if (currentPage.value < totalPages.value - range) pages.push(totalPages.value); // Ellipsis after range

  return pages;
});

// Change page
const changePage = (page: string | number) => {
  const pageNumber = typeof page === 'string' ? parseInt(page) : page;
  if (pageNumber >= 1 && pageNumber <= totalPages.value) {
    currentPage.value = pageNumber;
  }
};

onMounted(() => {
  getMethods();
});
</script>

<style scoped>
/* Pagination button styles handled by Tailwind */
</style>

<template>
  <div class="min-h-screen flex flex-col items-center bg-gray-100">
    <!-- Header -->
    <header class="w-full h-[120px] bg-[#EAEAEA] flex fixed items-center px-6 md:px-12 lg:px-20">
      <!-- Logo Fasilkom -->
      <div class="flex items-center w-full md:w-[334px] h-[57px] flex-shrink-0 gap-4">
        <img
          src="https://i.ibb.co/4WF64VD/Fasilkom-UI-Logo-1.png"
          alt="Fasilkom UI Logo"
          class="w-[58px] h-[57px] object-cover"
        />
        <div class="w-full md:w-[263px] flex-shrink-0">
          <div class="text-[16px] md:text-[24px] font-bold text-black leading-none capitalize">
            Information Retrieval
          </div>
          <div class="text-[10px] md:text-[16px] font-light text-black leading-none capitalize">
            fasilkom UI
          </div>
        </div>
      </div>
      <!-- Search Bar -->
      <div class="flex justify-center w-full md:w-3/4 pl-[10vh]">
        <select
          v-model="method"
          class="border rounded-l-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
        >
          <option v-for="(item, idx) in methodList" :key="idx" :value="item">
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
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="text-center mt-[140px]">
      <p>Loading...</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="text-red-500 text-center mt-[140px]">
      <p>{{ error }}</p>
    </div>

    <!-- Search Results -->
    <div v-if="results.length > 0 && !loading" class="mt-[140px] mb-[140px] w-[63vw]">
      <h3 class="text-lg font-bold mb-4">
        Search Results for "{{ searchQuery }}"
        <span v-if="retrievalTime !== null">
          ({{ paginatedResults.length }} results in {{ retrievalTime.toFixed(2) }}s)
        </span>
      </h3>

      <!-- Display Paginated Results -->
      <SearchResult
        v-for="(result, index) in paginatedResults"
        :key="index"
        :result="result"
        @view-detail="viewDetail"
      />

      <!-- Pagination Controls -->
      <div class="flex gap-3 justify-center mt-6 w-[325px] h-[45px] px-5 py-3">
        <!-- Previous Button (<<) -->
        <button
          v-if="currentPage > 1"
          @click="changePage(currentPage-1)"
          class="bg-blue-500 text-white rounded w-10 h-6 flex items-center justify-center"
        >
          &lt;&lt;
        </button>

        <!-- Page Buttons -->
        <button
          v-for="page in pagesToShow"
          :key="page"
          @click="changePage(page)"
          :class="[
            'w-6 h-6 flex items-center justify-center rounded',
            page === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-black border border-blue-500'
          ]"
          class="cursor-pointer hover:bg-blue-500 hover:text-white transition"
        >
          {{ page }}
        </button>

        <!-- Next Button (>>) -->
        <button
          v-if="currentPage < totalPages"
          @click="changePage(currentPage+1)"
          class="bg-blue-500 text-white rounded w-10 h-6 flex items-center justify-center"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
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
</template>
