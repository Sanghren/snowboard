// State object
import axios from "axios";
import {AdminState, ValidatorStatus} from "@/types";

const state: AdminState = {
    nodeId: "",
    validator: ValidatorStatus.UNKNOWN,
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
    setNodeId(state: AdminState, nodeId: string) {
        state.nodeId = nodeId;
    },
    setPeers(state: AdminState, peers: string[]) {
        state.peers = peers;
    },
    setNetworkIds(state: AdminState, networkIds: string) {
        state.networkId = networkIds;
    },
    setValidatorStatus(state: AdminState, validatorStatus: ValidatorStatus) {
        state.validator = validatorStatus;
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
