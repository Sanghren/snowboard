import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import {Metrics} from './modules/metrics.store';
import {Health} from './modules/health.store';
import {Api} from './modules/api.store';
import {Dashboard} from './modules/dashboard.store';
import {Tools} from './modules/tools.store';
import {createStore, Module} from 'vuex-smart-module'

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';


const root = new Module({
    modules: {
        Api,
        Dashboard,
        Health,
        Metrics,
        Tools,
    }
})

export const store = createStore(
    // Root module
    root,
    // Vuex store options
    {
        strict: debug,
        plugins: debug ? [createLogger()] : [],
    }
)


// export default new Vuex.Store({
//     modules: {
//         Keystore,
//         Metrics,
//         PChain,
//         XChain,
//         Health,
//         Api,
//         Tools,
//         Dashboard,
//     },
//     strict: debug,
//     plugins: debug ? [createLogger()] : [],
// })
