// State object
import {ApiState, Config} from "@/types";
import * as slopes from "slopes";

const state: ApiState = {
    bootstrapApi: {
        api: undefined,
        nodeUrl: process.env.VUE_APP_SNWBRD_BOOTSTRAP_HOST || 'bootstrap.ava.network',
        protocol: process.env.VUE_APP_SNWBRD_BOOTSTRAP_PROTOCOL || 'https',
        chainId: process.env.VUE_APP_SNWBRD_BOOTSTRAP_CHAIN_ID || '2',
        nodePort: process.env.VUE_APP_SNWBRD_BOOTSTRAP_PORT || '2100',
        networkId: process.env.VUE_APP_SNWBRD_BOOTSTRAP_NETWORK_ID || '4ktRjsAKxgMr2aEzv9SWmrU7Xk5FniHUrVCX4P1TZSfTLZWFM',
    },
    nodeApi: {
        api: undefined,
        nodeUrl: process.env.VUE_APP_SNWBRD_NODE_HOST || 'localhost',
        protocol: process.env.VUE_APP_SNWBRD_NODE_PROTOCOL || 'http',
        chainId: process.env.VUE_APP_SNWBRD_NODE_CHAIN_ID || '2',
        nodePort: process.env.VUE_APP_SNWBRD_NODE_PORT || '9650',
        networkId: process.env.VUE_APP_SNWBRD_NODE_NETWORK_ID || '4ktRjsAKxgMr2aEzv9SWmrU7Xk5FniHUrVCX4P1TZSfTLZWFM',
    }
}

function createSlopes(config: Config): slopes.Slopes {
    return new slopes.Slopes(
        config.nodeUrl,
        parseInt(config.nodePort),
        config.protocol,
        parseInt(config.networkId),
        config.chainId
    )
}

// Getter functions
const getters = {
    getNodeUrl: (state: ApiState) => {
        return state.nodeApi.protocol + "://" + state.nodeApi.nodeUrl + ":" + state.nodeApi.nodePort
    }
}

// Actions
const actions = {
    setupSlopes(context: any) {
        const bootstrapApi = createSlopes(context.state.bootstrapApi);
        const nodeApi = createSlopes(context.state.nodeApi);
        context.commit('setApis', [bootstrapApi, nodeApi]);
    },
    changeNodeUrl(context: any, update: Config){
        context.commit('updateNodeApiConfig', update);
        const nodeApi = createSlopes(context.state.nodeApi);
        context.commit('updateNodeApiSlopes', nodeApi);

    }
}
// Mutations
const mutations = {
    setApis(state: ApiState, apis: slopes.Slopes[]) {
        state.bootstrapApi.api = apis[0];
        state.nodeApi.api = apis[1];
    },
    updateNodeApiConfig(state: ApiState, update: Config) {
        state.nodeApi.nodeUrl = update.nodeUrl;
        state.nodeApi.protocol = update.protocol;
        state.nodeApi.nodePort = update.nodePort;
        state.nodeApi.chainId = update.chainId;
        state.nodeApi.networkId = update.networkId;
    },
    updateNodeApiSlopes(state: ApiState, api: slopes.Slopes) {
        state.nodeApi.api = api;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
