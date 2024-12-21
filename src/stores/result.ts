import type { ResultInterface } from "@/interfaces/result.interface";
import { defineStore } from "pinia";


export const useResultStore = defineStore("result", {
    state: () => ({
        results: [] as ResultInterface[],
        selectedResult: null as ResultInterface | null,
        loading: false,
        error: null as string | null
    }),
    actions: {
        setSelectedResult(result: ResultInterface) {
            this.selectedResult = result
        },
        async fetchResults(query: string, method: string) {
            if (!query.trim()) {
                this.error = "Query cannot be empty.";
                return;
            }

            this.loading = true; // Set loading to true while fetching data
            this.error = null;

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URI}/query?query=${query}&method=${method}`
                );
                const data = await response.json();
                console.log(data);

                if (data.status === 200) {
                    this.results = data.data;
                } else {
                    this.error = "No results found.";
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                this.error = "Failed to fetch data. Please try again later.";
            } finally {
                this.loading = false; // Set loading to false after fetching
            }
        },
    },
});
