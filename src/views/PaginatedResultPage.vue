<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useResultStore } from "@/stores/result";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import type { ResultInterface } from "@/interfaces/result.interface";
import SearchResult from "@/components/SearchResult.vue";

const route = useRoute();
const router = useRouter();
const resultStore = useResultStore();
const searchQuery = ref(route.query.search as string || "");
const method = ref(route.query.method as string || "BM25");
const results = computed(() => resultStore.results);
const loading = computed(() => resultStore.loading);
const error = computed(() => resultStore.error);
// Retrieval time from the query parameter
const retrievalTime = ref<number | null>(parseFloat(route.query.retrievalTime as string) || null);

const methodList = ref<string[]>([]);

// Pagination logic
const itemsPerPage = 30; // Number of results per page
const currentPage = ref(1);

// Get the list of methods
const getMethods = async () => {
  methodList.value = await resultStore.fetchFeatureList();
};

// Search function
const search = async () => {
  resultStore.clearResults();
  const startTime = performance.now();
  await resultStore.fetchResults(searchQuery.value, method.value);
  const endTime = performance.now();
  retrievalTime.value = ((endTime - startTime) / 1000);

  // Redirect to PaginatedResultPage after the search
  router.push({
    name: "PaginatedResultPage",
    query: {
      search: searchQuery.value,
      method: method.value,
      retrievalTime: retrievalTime.value,
    },
  });
};

// View details of a result
const viewDetail = (result: ResultInterface) => {
  resultStore.setSelectedResult(result);
  router.push({
    name: "DetailPage",
    params: {
      id: result.doc_id,
    },
    query: {
      search: searchQuery.value,
      method: method.value,
      retrievalTime: retrievalTime.value,
    },
  });
};

// Pagination logi
const totalResults = computed(() => results.value.length);
const totalPages = computed(() => Math.ceil(results.value.length / itemsPerPage));

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return results.value.slice(start, end);
});

// Determine pages to display
const pagesToShow = computed(() => {
  const pages = [];
  const range = 1; // Number of pages to show before and after the current page
  const start = Math.max(1, currentPage.value - range);
  const end = Math.min(totalPages.value, currentPage.value + range);

  if (currentPage.value > range + 1) pages.push("..."); // Ellipsis before range
  for (let i = start; i <= end; i++) pages.push(i);
  if (currentPage.value < totalPages.value - range) pages.push("..."); // Ellipsis after range

  return pages;
});

// Change page
const changePage = (page: string | number) => {
  const pageNumber = typeof page === 'string' ? parseInt(page) : page;
  if (pageNumber >= 1 && pageNumber <= totalPages.value) {
    currentPage.value = pageNumber;
  }
};

const truncatedSearchQuery = computed(() => {
  return searchQuery.value.length > 60
    ? searchQuery.value.substring(0, 60) + "..."
    : searchQuery.value;
});

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
      <!-- Search Bar -->
      <div class="flex justify-center w-full md:w-3/5 pl-[10vh]">
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
    <div v-if="results.length > 0 && !loading" class="mt-[100px] mb-[100px] w-[63vw] mr-[21vw]">
      <h3 class="text-lg font-bold mb-4">
        Search Results for "{{ truncatedSearchQuery }}"
        <span v-if="retrievalTime !== null">
          ({{ totalResults }} results in {{ retrievalTime.toFixed(2) }}s)
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
