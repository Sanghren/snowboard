// State object
import axios from "axios";
import {IAdminState} from "@/types";

const state: IAdminState = {
    nodeId: "",
    peers: [],
    networkId: "",
}


// Getter functions
const getters = {}


// Actions
const actions = {
    fetchNodeId(context: any) {
        return new Promise((resolve, reject) => {
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/admin', {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "admin.getNodeID"
                })
                .then((response) => context.commit('setNodeId', response.data.result.nodeID))
                .catch((e) => {
                    context.commit(('error'));
                })
        })
    },
    fetchNetworkIds(context: any) {
        return new Promise((resolve, reject) => {
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/admin', {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "admin.getNetworkID"
                })
                .then((response) => context.commit('setNetworkIds', response.data.result.networkID))
                .catch((e) => {
                    context.commit(('error'));
                })
        })
    },
    fetchPeers(context: any) {
        return new Promise((resolve, reject) => {
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/admin', {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "admin.peers"
                })
                .then((response) => context.commit('setPeers', response.data.result.peers))
                .catch((e) => {
                    context.commit(('error'));
                })
        })
    }
}
// Mutations
const mutations = {
    setNodeId(state: IAdminState, nodeId: string) {
        state.nodeId = nodeId;
    },
    setPeers(state: IAdminState, peers: string[]) {
        state.peers = peers;
    },
    setNetworkIds(state: IAdminState, networkIds: string) {
        state.networkId = networkIds;
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
