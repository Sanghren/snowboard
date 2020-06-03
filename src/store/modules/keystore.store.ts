import {ErrorContext, User} from "@/types";
import axios from "axios";
import {Actions, Context, Getters, Module, Mutations} from "vuex-smart-module";
import {Api, ApiState} from "@/store/modules/api.store";
import {Store} from "vuex";

class KeystoreState {
    users: User[] = [];
    loading = new Map();
    error = new Map();
}


// Getter functions
class KeystoreGetters extends Getters<KeystoreState> {
    getUsers() {
        return this.state.users;
    }
}


// Actions
class KeystoreActions extends Actions<KeystoreState,
    KeystoreGetters,
    KeystoreMutations,
    KeystoreActions> {
    // ToDo Figure this one out
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api: Context<typeof Api>;

    $init(store: Store<ApiState>): void {
        // Create and retain foo module context
        this.api = Api.context(store)
    }

    fetchUsers() {
        axios
            .post(this.api.getters.nodeUrl + '/ext/keystore', {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "keystore.listUsers"
            }, {headers: {"content-type": "application/json"}})
            .then((response) => this.commit('setUsers', response.data.result.users
            ))
            .catch((e) => {
                this.commit('setError', {key: 'fetchUsers', error: e});
            })
    }

    // exportUser(context: any, userInfo: User) {
    //     return new Promise((resolve, reject) => {
    //         axios
    //             .post(context.rootState.Metrics.nodeUrl + '/ext/keystore', {
    //                 "jsonrpc": "2.0",
    //                 "id": 1,
    //                 "method": "keystore.exportUser",
    //                 "params": {
    //                     "username": userInfo.name,
    //                     "password": userInfo.password
    //                 }
    //             }, {headers: {"content-type": "application/json"}})
    //             .then((response) => context.commit('setUserExport', {
    //                 name: userInfo.name,
    //                 exportData: response.data.result.user
    //             }))
    //             .catch((e) => {
    //                 context.commit(('error'));
    //             })
    //     })
    // },
    // deleteUser(context: any, userInfo: User) {
    //     return new Promise((resolve, reject) => {
    //         axios
    //             .post(context.rootState.Metrics.nodeUrl + '/ext/keystore', {
    //                 "jsonrpc": "2.0",
    //                 "id": 1,
    //                 "method": "keystore.deleteUser",
    //                 "params": {
    //                     "username": userInfo.name,
    //                     "password": userInfo.password
    //                 }
    //             }, {headers: {"content-type": "application/json"}})
    //             .then((response) => context.commit('setUsers', response.data.result.users.map((e: any) => {
    //                 return {
    //                     name: e,
    //                     password: "",
    //                     exportData: ""
    //                 }
    //             })))
    //             .catch((e) => {
    //                 context.commit(('error'));
    //             })
    //     })
    // },
    // createUser(context: any, userInfo: User) {
    //     return new Promise((resolve, reject) => {
    //         axios
    //             .post(context.rootState.Metrics.nodeUrl + '/ext/keystore', {
    //                 "jsonrpc": "2.0",
    //                 "id": 1,
    //                 "method": "keystore.createUser",
    //                 "params": {
    //                     "username": userInfo.name,
    //                     "password": userInfo.password
    //                 }
    //             }, {headers: {"content-type": "application/json"}})
    //             .then((response) => context.dispatch('fetchUsers'))
    //             .catch((e) => {
    //                 context.commit(('error'));
    //             })
    //     })
    // },
    // importUser(context: any, userInfo: User) {
    //     return new Promise((resolve, reject) => {
    //         axios
    //             .post(context.rootState.Metrics.nodeUrl + '/ext/keystore', {
    //                 "jsonrpc":"2.0",
    //                 "id"     :1,
    //                 "method" :"keystore.importUser",
    //                 "params" :{
    //                     "username": userInfo.name,
    //                     "password": userInfo.password,
    //                     "user"    : userInfo.exportData
    //                 }
    //             }, {headers: {"content-type": "application/json"}})
    //             .then((response) => context.dispatch('fetchUsers'))
    //             .catch((e) => {
    //                 context.commit(('error'));
    //             })
    //     })
    // }
}

// Mutations
class KeystoreMutations extends Mutations<KeystoreState> {
    setUsers(users: User[]) {
        this.state.users = users;
    }

    setError(error: ErrorContext) {
        this.state.users = [];
        this.state.error.set(error.key, error.error);
    }
}

export const Keystore = new Module({
    state: KeystoreState,
    getters: KeystoreGetters,
    mutations: KeystoreMutations,
    actions: KeystoreActions
})