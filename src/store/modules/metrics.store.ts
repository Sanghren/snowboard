// State object
import axios from "axios";
import parsePrometheusTextFormat from "parse-prometheus-text-format";
import {MetricsState} from "@/types";

const state: MetricsState = {
    nodeDown: true,
    nodeUrl: "https://bootstrap.ava.network:21000",
    metrics: []
}


// Getter functions
const getters = {
    isNodeDown(state: MetricsState) {
        return state.nodeDown;
    },
    metrics(state: MetricsState) {
        return state.metrics;
    },
}


// Actions
const actions = {
    //ToDo Find what is the type of context
    fetchMetrics(context: any) {
        axios
            .get(state.nodeUrl + '/ext/metrics')
            .then((response) => {
                context.commit('setMetrics', parsePrometheusTextFormat(response.data))
            })
            .catch((e: any) => {
                context.commit('error')
            });
    },
    async updateSettings(context: any, payload: string) {
        context.commit('setMetrics', []);
        context.commit('setNodeUrl', payload);
        await context.dispatch('Keystore/fetchUsers', null, {root: true})
        await context.dispatch('fetchMetrics')
    },
    async isNodeUp(context: any) {
        if (!state.nodeUrl) {
            context.commit('error')
        } else {
            await context.dispatch('fetchMetrics')
        }
    }
}
// Mutations
const mutations = {
    //ToDo Type the metrics
    setMetrics(state: MetricsState, data: []) {
        state.nodeDown = false;
        state.metrics = data
    },
    setNodeUrl(state: MetricsState, data: string) {
        state.nodeUrl = data
    },
    error(state: MetricsState) {
        state.metrics = [];
        state.nodeDown = true;
    },
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
