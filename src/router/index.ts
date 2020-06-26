import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import NodeMetrics from "@/views/NodeMetrics.vue";
import Settings from "@/views/Settings.vue";
import Users from "@/views/Users.vue";
import Accounts from "@/views/Accounts.vue";
import NodeDashboard from "@/views/NodeDashboard.vue";
import Tools from "@/views/Tools.vue";
import Staking from "@/views/Subnets.vue";
import Subnets from "@/views/Subnets.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Dashboard',
        component: NodeDashboard
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
        path: '/accounts/:id',
        props: true,
        name: 'Accounts',
        component: Accounts
    },
    {
        path: '/tools',
        name: 'Tools',
        component: Tools
    },
    {
        path: '/subnets',
        name: 'Subnets',
        component: Subnets
    }
]

const router = new VueRouter({
    routes
})

export default router
