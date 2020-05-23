import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import parsePrometheusTextFormat from "parse-prometheus-text-format";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    metrics:{}
  },
  mutations: {
    loadMetrics (state) {
      axios
          .get('http://localhost:9650/ext/metrics')
          .then((response) => state.metrics = parsePrometheusTextFormat(response.data));
    }
  },
  actions: {

  },
  modules: {
  }
})
