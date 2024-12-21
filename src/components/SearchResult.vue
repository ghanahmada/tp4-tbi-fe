<template>
  <div class="bg-white shadow-md rounded-lg p-4 mb-4 hover:shadow-lg transition">
    <h4
      class="text-xl font-semibold text-blue-500 cursor-pointer hover:underline"
      @click="$emit('view-detail', result)"
    >
      {{ result.title }}
    </h4>
    <p class="text-gray-700 mt-2">{{ truncateText(result.desc, 100) }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ResultInterface } from '@/interfaces/result.interface'

defineProps<{
  result: ResultInterface 
}>();

defineEmits<{
  (e: 'view-detail', result: ResultInterface): void
}>();

const truncateText = (text: string, length: number): string => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};
</script>

<style>
/* Tailwind CSS included in the main project */
</style>