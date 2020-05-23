import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import parsePrometheusTextFormat from "parse-prometheus-text-format";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nodeUrl: "http://localhost:9655",
    users: [],
    metrics: []
  },
  mutations: {
    loadMetrics (state) {
      axios
          .get(state.nodeUrl + '/ext/metrics')
          .then((response) => state.metrics = parsePrometheusTextFormat(response.data));
    },
    loadUsers (state) {
      axios
          .post(state.nodeUrl + '/ext/keystore', {"jsonrpc": "2.0", "id": 1, "method": "keystore.listUsers"}, {headers: {"content-type": "application/json"}})
          .then((response) => state.users = response.data);
    },
    updateSettings (state, payload) {
      state.nodeUrl = payload;
      state.metrics = [];
      axios
          .get(state.nodeUrl + '/ext/metrics')
          .then((response) => state.metrics = parsePrometheusTextFormat(response.data))
          .catch();
    }
  },
  actions: {
  },
  modules: {
  }
})
