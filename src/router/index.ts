import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Dashboard.vue'
import Dashboard from "@/views/Dashboard.vue";
import Settings from "@/views/Settings.vue";
import Users from "@/views/Users.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
]

const router = new VueRouter({
  routes
})

export default router
