import { createRouter, createWebHistory } from 'vue-router'
import DetailPage from '../views/DetailPage.vue'
import SearchPage from '../views/SearchPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "SearchPage", 
      component: SearchPage
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