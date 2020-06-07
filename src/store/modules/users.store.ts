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
        try {
            const usersName = await nodeApi.NodeKeys().listUsers();
            const users = usersName.map((name: string) => {
                return {name, password: "", exportData: "", accounts: []} as User
            })
            this.mutations.setUsers(users);
            this.mutations.setLoaded('fetchUsers');
        } catch (e) {
            this.mutations.setUsers([]);
            this.mutations.setError({key: 'fetchUsers', error: e});
            this.mutations.setLoaded('fetchUsers');
        }
    }

    async exportKeystoreUser(user: User) {
        this.mutations.setLoading('exportUser');
        if (!user.name || !user.password) {
            this.mutations.setError({key: 'exportUser', error: new Error('Missing username or password')});
            this.mutations.setLoaded('exportUser');
            return false;
        }
        try {
            const exportData = await nodeApi.NodeKeys().exportUser(user.name, user.password);
            this.mutations.setExportedData({name: user.name, exportData} as User);
            this.mutations.setLoaded('exportUser');
        } catch (e) {
            this.mutations.setExportedData({name: user.name, exportData: ""} as User);
            this.mutations.setError({key: 'exportUser', error: e});
            this.mutations.setLoaded('exportUser');
        }
    }

    async createKeystoreUser(user: User) {
        this.mutations.setLoading('createUser');
        if (!user.name || !user.password) {
            this.mutations.setError({key: 'createUser', error: new Error("Missing params")});
            this.mutations.setLoaded('createUser');
            return false;
        }
        try {
            const success = await nodeApi.NodeKeys().createUser(user.name, user.password);
            if (success) {
                await this.actions.fetchKeystoreUsers();
                this.mutations.setLoaded('createUser');
            } else {
                this.mutations.setError({key: 'createUser', error: new Error("User creation failed")});
                this.mutations.setLoaded('createUser');
            }
        } catch (e) {
            this.mutations.setError({key: 'createUser', error: e});
            this.mutations.setLoaded('createUser');
        }
    }

    async deleteKeystoreUser(user: User) {
        this.mutations.setLoading('deleteUser');
        if (!user.name || !user.password) {
            this.mutations.setError({key: 'deleteUser', error: new Error("Missing params")})
            this.mutations.setLoaded('deleteUser')
            return false
        }
        try {
            const success = await nodeApi.NodeKeys().deleteUser(user.name, user.password);
            if (success) {
                await this.actions.fetchKeystoreUsers();
                this.mutations.setLoaded('deleteUser');
            } else {
                this.mutations.setLoaded('deleteUser');
                this.mutations.setError({key: 'deleteUser', error: new Error("User deletion failed")});
            }
        } catch (e) {
            this.mutations.setError({key: 'deleteUser', error: e});
            this.mutations.setLoaded('deleteUser');
        }
    }

    async importKeystoreUser(user: User) {
        this.mutations.setLoading('importUser');
        if (!user.name || !user.password || !user.exportData) {
            this.mutations.setError({key: 'importUser', error: new Error("Missing params")});
            this.mutations.setLoaded('importUser');
            return false;
        }
        try {
            const success = await nodeApi.NodeKeys().importUser(user.name, user.exportData, user.password);
            if (success) {
                await this.actions.fetchKeystoreUsers();
                this.mutations.setLoaded('importUser');
            } else {
                this.mutations.setLoaded('importUser');
                this.mutations.setError({key: 'importUser', error: new Error("User import failed")});
            }
        } catch (e) {
            this.mutations.setLoaded('importUser');
            this.mutations.setError({key: 'importUser', error: e});
        }
    }
}

export const Users = new Module({
    state: UsersState,
    getters: UsersGetters,
    mutations: UsersMutations,
    actions: UsersActions
})
