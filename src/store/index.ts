import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import parsePrometheusTextFormat from "parse-prometheus-text-format";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nodeUrl: "http://localhost:9655/ext/metrics",
    metrics: []
  },
  mutations: {
    loadMetrics (state) {
      axios
          .get(state.nodeUrl)
          .then((response) => state.metrics = parsePrometheusTextFormat(response.data));
    },
    updateSettings (state, payload) {
      state.nodeUrl = payload;
      state.metrics = [];
      axios
          .get(state.nodeUrl)
          .then((response) => state.metrics = parsePrometheusTextFormat(response.data))
          .catch();
    }
  },
  actions: {
  },
  modules: {
  }
})
