import {User} from "@/types";
import axios from "axios";
import {Actions, Context, Getters, Module, Mutations} from "vuex-smart-module";
import {Api} from "@/store/modules/api.store";
import {Store} from "vuex";

class KeystoreState {
    users: User[] = []
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

    $init(store: Store<any>): void {
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
            .then((response) => this.commit('setUsers', response.data.result.users.map((e: any) => {
                return {
                    name: e,
                    password: "",
                    exportData: ""
                }
            })))
            .catch((e) => {
                this.commit(('error'));
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

    error() {
        this.state.users = [];
    }
}

export const Keystore = new Module({
    state: KeystoreState,
    getters: KeystoreGetters,
    mutations: KeystoreMutations,
    actions: KeystoreActions
})