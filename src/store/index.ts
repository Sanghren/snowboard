import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import Keystore from './modules/keystore.store';
import Metrics from './modules/metrics.store';
import Admin from './modules/admin.store';

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';
export default new Vuex.Store({
  modules: {
    Keystore,
    Metrics,
    Admin
  },
  strict: debug,
  plugins: debug? [ createLogger() ] : [],
})
