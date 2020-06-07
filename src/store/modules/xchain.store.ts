// State object
import axios from "axios";
import {TxStatusRes, TxStatusUdate, XBalance, XChainState} from "@/types";

const state: XChainState = {
    bootstrapped: false,
    balance: {
        balance: 0,
        utxoIDs: [],
    },
    txs: []
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
    },
    async checkTxStatus(context: any, txCheck: any) {
        return await axios
            .post(`${txCheck.ownNode ? context.rootState.Metrics.nodeUrl : context.rootState.Metrics.bootstrapNodeUrl}` + '/ext/bc/X', {
                "jsonrpc": "2.0",
                "id": 6,
                "method": "avm.getTxStatus",
                "params": {
                    "txID": txCheck.txId
                }
            }, {timeout: 120000})
            .then((response) => {
                if (response.data.error) {
                    context.commit('setTxStatus', {
                        txId: txCheck.txId,
                        ownNode: txCheck.ownNode,
                        txStatus: "INVALID"
                    })
                } else {
                    context.commit('setTxStatus', {
                        txId: txCheck.txId,
                        ownNode: txCheck.ownNode,
                        txStatus: response.data.result.status.toUpperCase()
                    })
                }

            })
            .catch((e) => {
                //Do nothing
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
    setTxStatus(state: XChainState, res: TxStatusUdate) {
        const toUpdate = state.txs.find((i: TxStatusRes) => i.txId === res.txId);
        if (toUpdate) {
            switch (res.ownNode) {
                case true:
                    toUpdate.txStatusOwnNode = res.txStatus;
                    break;
                case false:
                    toUpdate.txStatusBootstrapNode = res.txStatus;
                    break;
            }
        } else {
            switch (res.ownNode) {
                case true:
                    state.txs.push({txStatusOwnNode: res.txStatus,txStatusBootstrapNode: "UNKNOWN", txId: res.txId} as TxStatusRes);
                    break
                case false:
                    state.txs.push({txStatusBootstrapNode: res.txStatus, txStatusOwnNode: "UNKNOWN", txId: res.txId} as TxStatusRes);
                    break
            }
        }
    },
    cleanTxs(state: XChainState) {
        state.txs = [];
    },
    error(state: XChainState) {
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
