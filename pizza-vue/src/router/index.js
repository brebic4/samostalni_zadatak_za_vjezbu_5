import { createRouter, createWebHistory } from 'vue-router'
import PizzaList from '../components/PizzaList.vue'
import PizzaDetails from '../components/PizzaDetails.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: PizzaList,
  },
  {
    path: '/pizze/:naziv',
    name: 'PizzaDetails',
    component: PizzaDetails,
    props: true, // omogućuje props route parametara
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
