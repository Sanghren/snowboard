// State object
import {IKeystoreState, IMetricsState, IUser} from "@/types";
import axios from "axios";

const state: IKeystoreState = {
    users: [],
}


// Getter functions
const getters = {
    getUsers(state: IKeystoreState) {
        return state.users;
    },
}


// Actions
const actions = {
    fetchUsers(context: any) {
        return new Promise((resolve, reject) => {
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/keystore', {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "keystore.listUsers"
                }, {headers: {"content-type": "application/json"}})
                .then((response) => context.commit('setUsers', response.data.result.users.map((e: any) => {
                    return {
                        name: e,
                        password: "",
                        exportData: ""
                    }
                })))
                .catch((e) => {
                    context.commit(('error'));
                })
        })
    },
    exportUser(context: any, userInfo: IUser) {
        return new Promise((resolve, reject) => {
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/keystore', {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "keystore.exportUser",
                    "params": {
                        "username": userInfo.name,
                        "password": userInfo.password
                    }
                }, {headers: {"content-type": "application/json"}})
                .then((response) => context.commit('setUserExport', {
                    name: userInfo.name,
                    exportData: response.data.result.user
                }))
                .catch((e) => {
                    context.commit(('error'));
                })
        })
    },
    deleteUser(context: any, userInfo: IUser) {
        return new Promise((resolve, reject) => {
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/keystore', {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "keystore.deleteUser",
                    "params": {
                        "username": userInfo.name,
                        "password": userInfo.password
                    }
                }, {headers: {"content-type": "application/json"}})
                .then((response) => context.commit('setUsers', response.data.result.users.map((e: any) => {
                    return {
                        name: e,
                        password: "",
                        exportData: ""
                    }
                })))
                .catch((e) => {
                    context.commit(('error'));
                })
        })
    },
    createUser(context: any, userInfo: IUser) {
        return new Promise((resolve, reject) => {
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/keystore', {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "keystore.createUser",
                    "params": {
                        "username": userInfo.name,
                        "password": userInfo.password
                    }
                }, {headers: {"content-type": "application/json"}})
                .then((response) => context.dispatch('fetchUsers'))
                .catch((e) => {
                    context.commit(('error'));
                })
        })
    },
    importUser(context: any, userInfo: IUser) {
        return new Promise((resolve, reject) => {
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/keystore', {
                    "jsonrpc":"2.0",
                    "id"     :1,
                    "method" :"keystore.importUser",
                    "params" :{
                        "username": userInfo.name,
                        "password": userInfo.password,
                        "user"    : userInfo.exportData
                    }
                }, {headers: {"content-type": "application/json"}})
                .then((response) => context.dispatch('fetchUsers'))
                .catch((e) => {
                    context.commit(('error'));
                })
        })
    }
}
// Mutations
const mutations = {
    setUsers(state: IKeystoreState, users: IUser[]) {
        state.users = users;
    },
    setUserExport(state: IKeystoreState, userExport: IUser) {
        const index = state.users.findIndex(item => item.name === userExport.name);
        state.users[index].exportData = userExport.exportData;
    },
    error(state: IKeystoreState) {
        state.users = [];
    }
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}