// State object
import axios from "axios";
import {Blockchain, PChainState, Validator, ValidatorStatus} from "@/types";

const state: PChainState = {
    blockchains: [],
    validators: []
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
    async fetchCurrentValidators(context: any) {
        return new Promise((resolve, reject) => {
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/P', {
                    "jsonrpc": "2.0",
                    "method": "platform.getCurrentValidators",
                    "params": {},
                    "id": 1
                })
                .then(async (response) => {
                    context.commit('setCurrentValidators', response.data.result.validators);
                    const res = response.data.result.validators.filter((v: Validator) => v.id === context.rootState.Admin.nodeId);
                    if (res) {
                        context.commit('Admin/setValidatorStatus', ValidatorStatus.VALIDATING, {root: true})
                    } else {
                        await context.dispatch('fetchPendingValidators');
                    }
                })
                .catch((e) => {
                    context.commit(('error'));
                })
        })
    },
    fetchPendingValidators(context: any) {
        return new Promise((resolve, reject) => {
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/P', {
                    "jsonrpc": "2.0",
                    "method": "platform.getPendingValidators",
                    "params": {},
                    "id": 1
                })
                .then((response) => {
                    const res = response.data.result.validators.filter((v: Validator) => v.id === context.rootState.Admin.nodeId);
                    if (res) {
                        context.commit('Admin/setValidatorStatus', ValidatorStatus.PENDING, {root: true})
                    }
                })
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
                    "params": {
                        "blockchainID": blockchainId
                    },
                })
                .then((response) => context.commit('setBlockchainStatus', {
                    id: blockchainId,
                    status: response.data.result.status
                }))
                .catch((e) => {
                    context.commit(('error'));
                })
        })
    },
    fetchAccountPerUser(context: any, userInfo: any) {
        return new Promise((resolve, reject) => {
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/P', {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "platform.listAccounts",
                    "params": {
                        "username": userInfo.username,
                        "password": userInfo.password
                    }
                })
                .then((response) => context.commit('Keystore/setAccountsForUser', {
                    name: userInfo.username,
                    accounts: response.data.result.status
                }))
                .catch((e) => {
                    context.commit(('error'));
                })
        })
    },
    //ToDo Type this !
    createAccountForUser(context: any, userInfo: any) {
        return new Promise((resolve, reject) => {
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/P', {
                    "jsonrpc": "2.0",
                    "method": "platform.createAccount",
                    "params": {
                        "username": userInfo.username,
                        "password": userInfo.password,
                        //ToDo Enable this
                        // "privateKey": userInfo.privateKey
                    },
                    "id": 1
                })
                .then((response) => {
                    console.log("BOUH")
                    context.commit('Keystore/setAccountsForUser', {
                            name: userInfo.username,
                            accounts: [response.data.result.address]
                        }, {root: true}
                    )
                })
                .catch((e) => {
                    console.log("HERE ?")
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
    setCurrentValidators(state: PChainState, validators: Validator[]) {
        state.validators = validators;

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
