import { createRouter, createWebHistory } from 'vue-router'
import DetailPage from '../views/DetailPage.vue'
import MainPage from '../views/MainPage.vue'
import PaginatedResultPage from '../views/PaginatedResultPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "MainPage",
      component: MainPage
    },
    {
      path: "/result",
      name: "PaginatedResultPage",
      component: PaginatedResultPage
    },
    {
      path: "/detail/:id",  // Add parameter in path
      name: "DetailPage",
      component: DetailPage,
      props: true
    }
  ]
})

export default router
