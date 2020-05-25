import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import Keystore from './modules/keystore.store';
import Metrics from './modules/metrics.store';
import Admin from './modules/admin.store';
import PChain from './modules/pchain.store';
import XChain from './modules/xchain.store';
import Health from './modules/health.store';

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';
export default new Vuex.Store({
  modules: {
    Keystore,
    Metrics,
    Admin,
    PChain,
    XChain,
    Health
  },
  strict: debug,
  plugins: debug? [ createLogger() ] : [],
})
