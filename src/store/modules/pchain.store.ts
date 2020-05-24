// State object
import axios from "axios";
import {IAdminState, IBlockchain, IPChainState} from "@/types";

const state: IPChainState = {
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
}
// Mutations
const mutations = {
    setBlockchains(state: IPChainState, blockchains: IBlockchain[]) {
        state.blockchains = blockchains;
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
