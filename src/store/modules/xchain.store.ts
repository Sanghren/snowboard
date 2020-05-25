// State object
import axios from "axios";
import {Blockchain, PChainState, XBalance, XChainState} from "@/types";

const state: XChainState = {
    bootstrapped: false,
    balance: {
        balance: 0,
        utxoIDs: []
    }
}

// Getter functions
const getters = {}

// Actions
const actions = {
    fetchBalance(context: any) {
        return new Promise((resolve, reject) => {
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/X', {
                    "jsonrpc": "2.0",
                    "id": 2,
                    "method": "avm.getBalance",
                    "params": {
                        "address": "X-6cesTteH62Y5mLoDBUASaBvCXuL2AthL", //Faucet address
                        "assetID": "AVA"
                    }
                }, {timeout: 60000})
                .then((response) => context.commit('setBalance', response.data.result.balance))
                .catch((e) => {
                    context.commit(('error'));
                })
        })
    }
}
// Mutations
const mutations = {
    setBalance(state: XChainState, balance: XBalance) {
        //ToDo Improve the logic here !
        if (balance.balance !== 0) {
            state.balance = balance;
        }
    },
    error(state: XChainState) {
        console.log("ERROR");
        state.balance.balance = 0;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
