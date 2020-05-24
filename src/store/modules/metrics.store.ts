// State object
import axios from "axios";
import parsePrometheusTextFormat from "parse-prometheus-text-format";
import {IMetricsState} from "@/types";

const state: IMetricsState = {
    nodeDown: true,
    nodeUrl: "http://localhost:9650",
    metrics: []
}


// Getter functions
const getters = {
    isNodeDown( state: IMetricsState ) {
        return state.nodeDown;
    },
    metrics( state: IMetricsState ) {
        return state.metrics;
    },
}


// Actions
const actions = {
    //ToDo Find what is the type of context
    fetchMetrics(context: any){
        axios
            .get(state.nodeUrl + '/ext/metrics')
            .then((response) => {
                context.commit('setMetrics', parsePrometheusTextFormat(response.data))
            })
            .catch((e: any) => {
                context.commit('error')
        });
    },
    async updateSettings(context: any, payload: string){
        context.commit('setMetrics', []);
        context.commit('setNodeUrl', payload);
        await context.dispatch('Keystore/fetchUsers', null, { root: true})
        await context.dispatch('fetchMetrics')
    },
    async isNodeUp(context: any){
        if(!state.nodeUrl){
            context.commit('error')
        } else {
            await context.dispatch('fetchMetrics')
        }
    }
}
// Mutations
const mutations = {
    //ToDo Type the metrics
    setMetrics (state: IMetricsState, data: []) {
        state.nodeDown = false;
        state.metrics = data
    },
    setNodeUrl (state: IMetricsState, data: string) {
        state.nodeUrl = data
    },
    error (state: IMetricsState) {
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
