// State object
import {ErrorContext, User} from "@/types";
import {nodeApi} from "@/AVA";
import {Actions, createMapper, Getters, Module, Mutations} from "vuex-smart-module";

class UsersState {
    users: User[] = [];
    loading = new Map();
    error = new Map()
}

class UsersGetters extends Getters<UsersState> {
    isLoading(key: string) {
        return this.state.loading.has(key) ? this.state.loading.get(key) : false;
    }

}

class UsersMutations extends Mutations<UsersState> {
    setUsers(users: User[]) {
        this.state.users = users;
    }

    setExportedData(update: User) {
        const toUpdate = this.state.users.find((i: User) => i.name === update.name);
        if (toUpdate) {
            toUpdate.exportData = update.exportData;
        }
    }

    setLoading(key: string) {
        this.state.loading.set(key, true)
    }

    setLoaded(key: string) {
        this.state.loading.set(key, false);
    }

    setError(errorContext: ErrorContext) {
        this.state.error.set(errorContext.key, errorContext.error)
    }
}

class UsersActions extends Actions<UsersState,
    UsersGetters,
    UsersMutations,
    UsersActions> {
    async fetchKeystoreUsers() {
        this.mutations.setLoading('fetchUsers');
        const usersName = await nodeApi.NodeKeys().listUsers();
        const users = usersName.map((name: string) => {
            return {name, password: "", exportData: "", accounts: []} as User
        })
        this.mutations.setUsers(users);
        this.mutations.setLoaded('fetchUsers');
    }

    async exportKeystoreUser(user: User) {
        this.mutations.setLoading('exportUser');
        if (user.name && user.password) {
            const exportData = await nodeApi.NodeKeys().exportUser(user.name, user.password);
            this.mutations.setExportedData({name: user.name, exportData} as User);
        }
        this.mutations.setLoaded('exportUser');
    }

    async createKeystoreUser(user: User) {
        this.mutations.setLoading('createUser');
        if (user.name && user.password) {
            const success = await nodeApi.NodeKeys().createUser(user.name, user.password);
            if (success) {
                await this.actions.fetchKeystoreUsers();
                this.mutations.setLoaded('createUser');
            } else {
                this.mutations.setLoaded('createUser');
                this.mutations.setError({key: 'createUser', error: new Error("User creation failed")});
            }
        }
        this.mutations.setError({key: 'createUser', error: new Error("User creation failed")});
        this.mutations.setLoaded('createUser');
    }

    async deleteKeystoreUser(user: User) {
        this.mutations.setLoading('deleteUser');
        if (user.name && user.password) {
            const success = await nodeApi.NodeKeys().deleteUser(user.name, user.password);
            if (success) {
                await this.actions.fetchKeystoreUsers();
                this.mutations.setLoaded('deleteUser');
            } else {
                this.mutations.setLoaded('deleteUser');
                this.mutations.setError({key: 'deleteUser', error: new Error("User deletion failed")});
            }
        }
        this.mutations.setError({key: 'deleteUser', error: new Error("User deletion failed")});
        this.mutations.setLoaded('deleteUser');
    }

    async importKeystoreUser(user: User) {
        this.mutations.setLoading('importUser');
        if (user.name && user.password && user.exportData) {
            const success = await nodeApi.NodeKeys().importUser(user.name, user.exportData, user.password);
            if (success) {
                await this.actions.fetchKeystoreUsers();
                this.mutations.setLoaded('importUser');
            } else {
                this.mutations.setLoaded('importUser');
                this.mutations.setError({key: 'importUser', error: new Error("User import failed")});
            }
        }
        this.mutations.setError({key: 'importUser', error: new Error("User import failed")});
        this.mutations.setLoaded('importUser');
    }
}

export const Users = new Module({
    state: UsersState,
    getters: UsersGetters,
    mutations: UsersMutations,
    actions: UsersActions
})
