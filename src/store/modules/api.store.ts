// State object
import {ApiState, Config} from "@/types";
import {nodeApi, updateSlopesApi} from "@/AVA";

const state: ApiState = {
    bootstrapApi: {
        nodeUrl: process.env.VUE_APP_SNWBRD_BOOTSTRAP_HOST || 'bootstrap.ava.network',
        protocol: process.env.VUE_APP_SNWBRD_BOOTSTRAP_PROTOCOL || 'https',
        chainId: process.env.VUE_APP_SNWBRD_BOOTSTRAP_CHAIN_ID || '2',
        nodePort: process.env.VUE_APP_SNWBRD_BOOTSTRAP_PORT || '2100',
        networkId: process.env.VUE_APP_SNWBRD_BOOTSTRAP_NETWORK_ID || '4ktRjsAKxgMr2aEzv9SWmrU7Xk5FniHUrVCX4P1TZSfTLZWFM',
    },
    nodeApi: {
        nodeUrl: process.env.VUE_APP_SNWBRD_NODE_HOST || 'localhost',
        protocol: process.env.VUE_APP_SNWBRD_NODE_PROTOCOL || 'http',
        chainId: process.env.VUE_APP_SNWBRD_NODE_CHAIN_ID || '2',
        nodePort: process.env.VUE_APP_SNWBRD_NODE_PORT || '9650',
        networkId: process.env.VUE_APP_SNWBRD_NODE_NETWORK_ID || '4ktRjsAKxgMr2aEzv9SWmrU7Xk5FniHUrVCX4P1TZSfTLZWFM',
    }
}

// Getter functions
const getters = {
    getNodeUrl: (state: ApiState) => {
        return state.nodeApi.protocol + "://" + state.nodeApi.nodeUrl + ":" + state.nodeApi.nodePort
    },
}

// Actions
const actions = {
    async changeNodeUrl(context: any, update: Config) {
        context.commit('updateNodeApiConfig', update);

        updateSlopesApi(context.state.nodeApi);
    }
}
// Mutations
const mutations = {
    updateNodeApiConfig(state: ApiState, update: Config) {
        state.nodeApi.nodeUrl = update.nodeUrl;
        state.nodeApi.protocol = update.protocol;
        state.nodeApi.nodePort = update.nodePort;
        state.nodeApi.chainId = update.chainId;
        state.nodeApi.networkId = update.networkId;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
