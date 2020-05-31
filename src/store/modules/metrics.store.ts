// State object
import axios from "axios";
import parsePrometheusTextFormat from "parse-prometheus-text-format";
import {DashboardState, ErrorContext, MetricsState} from "@/types";

const state: MetricsState = {
    metrics: [],
    loading: new Map(),
    error: new Map()
}


// Getter functions
const getters = {
    metrics(state: MetricsState) {
        return state.metrics;
    },
}


// Actions
const actions = {
    //ToDo Find what is the type of context

    fetchMetrics(context: any) {
        context.commit('setLoading', 'metrics')
        axios
            .get(context.rootGetters["Api/getNodeUrl"] + '/ext/metrics')
            .then((response) => {
                context.commit('setMetrics', parsePrometheusTextFormat(response.data))
                context.commit('setLoaded', 'metrics')
            })
            .catch((e: any) => {
                context.commit('error', {key: 'metrics', e})
                context.commit('setLoaded', 'metrics')
            });
    },
}
// Mutations
const mutations = {
    setMetrics(state: MetricsState, data: []) {
        state.metrics = data
    },
    setLoading(state: MetricsState, key: string) {
        state.loading.set(key, true)
    },
    setLoaded(state: MetricsState, key: string) {
        state.loading.set(key, false);
    },
    setError(state: MetricsState, errorContext: ErrorContext) {
        state.metrics = [];
        state.error.set(errorContext.key, errorContext.error)
    },
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
