import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import Keystore from './modules/keystore.store';
import Metrics from './modules/metrics.store';
import Admin from './modules/admin.store';
import PChain from './modules/pchain.store';
import XChain from './modules/xchain.store';
import Health from './modules/health.store';
import Api from './modules/api.store';
import Dashboard from './modules/dashboard.store';
import Tools from './modules/tools.store';

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';
export default new Vuex.Store({
  modules: {
    Keystore,
    Metrics,
    Admin,
    PChain,
    XChain,
    Health,
    Api,
    Tools,
    Dashboard
  },
  strict: debug,
  plugins: debug? [ createLogger() ] : [],
})
