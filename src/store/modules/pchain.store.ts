// State object
import axios from "axios";
import {BlockchainStatus, AdminState, Blockchain, PChainState} from "@/types";

const state: PChainState = {
    blockchains: []
}


// Getter functions
const getters = {}


// Actions
const actions = {
    fetchBlockchains(context: any) {
        return new Promise((resolve, reject) => {
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/P', {
                    "jsonrpc": "2.0",
                    "method": "platform.getBlockchains",
                    "params": {},
                    "id": 1
                })
                .then((response) => context.commit('setBlockchains', response.data.result.blockchains))
                .catch((e) => {
                    context.commit(('error'));
                })
        })
    },
    fetchBlockchainStatus(context: any, blockchainId: string) {
        return new Promise((resolve, reject) => {
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/P', {
                    "jsonrpc": "2.0",
                    "method": "platform.getBlockchainStatus",
                    "params":{
                        "blockchainID": blockchainId
                    },
                })
                .then((response) => context.commit('setBlockchainStatus', {id:blockchainId, status:response.data.result.status}))
                .catch((e) => {
                    context.commit(('error'));
                })
        })
    },
}
// Mutations
const mutations = {
    setBlockchains(state: PChainState, blockchains: Blockchain[]) {
        state.blockchains = blockchains;
    },
    setBlockchainStatus(state: PChainState, blockchain: Blockchain) {
        const index = state.blockchains.findIndex(item => item.id === blockchain.id);
        state.blockchains[index].status = blockchain.status;

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
