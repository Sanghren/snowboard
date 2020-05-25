// State object
import axios from "axios";
import {AdminState, HealthState} from "@/types";

const state: HealthState = {
    healthy: false,
    checks: {}
}


// Getter functions
const getters = {}


// Actions
const actions = {
    fetchLiveness(context: any) {
        return new Promise((resolve, reject) => {
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/health', {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "health.getLiveness"
                })
                .then((response) => context.commit('setHealthy', response.data.result.healthy))
                .catch((e) => {
                    context.commit(('error'));
                })
        })
    }
}
// Mutations
const mutations = {
    setHealthy(state: HealthState, healthy: boolean) {
        state.healthy = healthy;
    },
    error() {
        console.log("ERROR")
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
