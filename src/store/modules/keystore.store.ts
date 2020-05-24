// State object
import {IKeystoreState, IMetricsState, IUser} from "@/types";
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
    fetchUsers(context: any) {
        return new Promise((resolve, reject) => {
            console.log("BOUH - ", context)
            axios
                .post(context.rootState.Metrics.nodeUrl + '/ext/keystore', {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "keystore.listUsers"
                }, {headers: {"content-type": "application/json"}})
                .then((response) => context.commit('setUsers', response.data.result.users))
                .catch((e) => {
                    context.commit(('error'));
                })
        })
    },
}
// Mutations
const mutations = {
    setUsers(state: IKeystoreState, users: IUser[]) {
            state.users = users;
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