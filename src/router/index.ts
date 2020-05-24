import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Home from '../views/NodeMetrics.vue'
import NodeMetrics from "@/views/NodeMetrics.vue";
import Settings from "@/views/Settings.vue";
import Users from "@/views/Users.vue";
import NodeInfo from "@/views/NodeInfo.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/node-metrics',
        name: 'NodeMetrics',
        component: NodeMetrics
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
    {
        path: '/node-info',
        name: 'NodeInfo',
        component: NodeInfo
    },
]

const router = new VueRouter({
    routes
})

export default router
