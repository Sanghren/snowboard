// State object
import {IKeystoreState, IMetricsState} from "@/types";
import axios from "axios";

const state: IKeystoreState = {
    users: []
}


// Getter functions
const getters = {
    getUsers(state: IKeystoreState) {
        return state.users;
    },
}


// Actions
const actions = {

    fetchUsers(commit: any) {
        return new Promise((resolve, reject) => {
            // Make network request and fetch data
            // and commit the data
            const data = {}
            commit('SET_USERS', data);
            resolve();
        })
    },
}
// Mutations
const mutations = {
    loadUsers(state: IKeystoreState, nodeUrl: string) {
        axios
            .post(nodeUrl + '/ext/keystore', {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "keystore.listUsers"
            }, {headers: {"content-type": "application/json"}})
            .then((response) => state.users = response.data);
    },
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}