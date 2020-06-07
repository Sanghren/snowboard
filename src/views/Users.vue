<template>
    <div class="usertable">
        <v-container fluid class="theme--dark lighten-5">
            <div v-if="this.checkCreateUserError() || this.checkDeleteUserError() || this.checkExportUserError() || this.checkImportUserError()" width="100%"
                 class="red--text" height="100%">
                <v-alert
                        dismissible
                        border="bottom"
                        color="pink darken-1"
                        dark
                >
                    {{ this.checkCreateUserError() || this.checkDeleteUserError() || this.checkExportUserError() || this.checkImportUserError() }}
                </v-alert>
            </div>
            <v-snackbar
                    v-model="snackbar"
                    :timeout="timeout"
            >
                {{ text }}
                <v-btn
                        color="blue"
                        text
                        @click="snackbar = false"
                >
                    Close
                </v-btn>
            </v-snackbar>
            <h1 class="text-lg-center">Keystore Users</h1>
            <v-simple-table dense class="ml-5 mr-5">
                <thead>
                <tr>
                    <th class="text-left">User</th>
                    <th class="text-left">Export Data</th>
                    <th class="text-right">Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(user, index) in $store.state.Users.users" :key="index" class="mb-4">
                    <td>{{user.name}}</td>
                    <td class="truncate">
                        <button v-if="user.exportData.length > 0" type="button"
                                v-clipboard:copy="user.exportData"
                                @click="snackbar = true">
                            <span class="material-icons">
                                file_copy
                            </span>
                        </button>
                        {{user.exportData}}
                    </td>
                    <td class="text-right">
                        <v-dialog v-model="exportDialog[user.name]" persistent max-width="290">
                            <template v-slot:activator="{ on }">
                                <v-btn color="primary" dark small text v-on="on">Export</v-btn>
                            </template>
                            <v-card>
                                <v-card-title class="headline">Export a user</v-card-title>
                                <v-card-text>
                                    <v-form>
                                        <v-container fluid>
                                            <v-row>
                                                <v-text-field
                                                        v-model="password"
                                                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                                        :type="show1 ? 'text' : 'password'"
                                                        name="input-10-1"
                                                        label="Password"
                                                        :rules="[rules.required, rules.min, rules.complexity]"
                                                        hint="At least 8 characters"
                                                        counter
                                                        @click:append="show1 = !show1"
                                                ></v-text-field>
                                            </v-row>
                                        </v-container>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="green darken-1" text @click="exportUser(user.name)">Export</v-btn>
                                    <v-btn color="green darken-1" text @click="exportDialog = false">Close
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <!--                        <v-btn color="primary" dark small text class="ml-1" @click="navigate(user.name)">Accounts-->
                        <!--                        </v-btn>-->
                        <v-dialog v-model="deleteDialog[user.name]" persistent max-width="290">
                            <template v-slot:activator="{ on }">
                                <v-btn color="primary" dark small text class="ml-1" v-on="on">Delete</v-btn>
                            </template>
                            <v-card>
                                <v-card-title class="headline">Delete this user on the node ?</v-card-title>
                                <v-form>
                                    <v-container fluid>
                                        <v-row>
                                            <v-text-field
                                                    v-model="password"
                                                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                                    :type="show1 ? 'text' : 'password'"
                                                    name="input-10-1"
                                                    label="Password"
                                                    :rules="[rules.required, rules.min, rules.complexity]"
                                                    hint="At least 8 characters"
                                                    counter
                                                    @click:append="show1 = !show1"
                                            ></v-text-field>
                                        </v-row>
                                    </v-container>
                                </v-form>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="green darken-1" text @click="deleteUser(user.name)">Delete</v-btn>
                                    <v-btn color="green darken-1" text @click="$set(deleteDialog, user.name, false)">
                                        Close
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </td>
                </tr>
                </tbody>
            </v-simple-table>
            <div class="text-md-center mt-5">
                <v-dialog v-model="createDialog" persistent max-width="290">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark small text v-on="on">Create user</v-btn>
                    </template>
                    <v-card>
                        <v-card-title class="headline">Create a user</v-card-title>
                        <v-form>
                            <v-container fluid>
                                <v-row>
                                    <v-text-field
                                            v-model="username"
                                            name="input-10-1"
                                            label="User name"
                                            counter
                                            @click:append="show1 = !show1"
                                    ></v-text-field>
                                </v-row>
                                <v-row>
                                    <v-text-field
                                            v-model="password"
                                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                            :type="show1 ? 'text' : 'password'"
                                            name="input-10-1"
                                            :rules="[rules.required, rules.min, rules.complexity]"
                                            label="Password"
                                            hint="At least 8 characters. With upper,lower,numbers and symbols"
                                            counter
                                            @click:append="show1 = !show1"
                                    ></v-text-field>
                                </v-row>
                            </v-container>
                        </v-form>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" text @click="createDialog = false">Cancel</v-btn>
                            <v-btn color="green darken-1" text @click="createUser()">Create</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="importDialog" class="text-md-center" persistent max-width="290">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark small text v-on="on">Import a user</v-btn>
                    </template>
                    <v-card>
                        <v-card-title class="headline">Import a user</v-card-title>
                        <v-form>
                            <v-container fluid>
                                <v-row>
                                    <v-text-field
                                            v-model="username"
                                            name="input-10-1"
                                            label="User name"
                                            counter
                                            @click:append="show1 = !show1"
                                    ></v-text-field>
                                </v-row>
                                <v-row>
                                    <v-text-field
                                            v-model="userData"
                                            name="input-10-1"
                                            label="User data"
                                            @click:append="show1 = !show1"
                                    ></v-text-field>
                                </v-row>
                                <v-row>
                                    <v-text-field
                                            v-model="password"
                                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                            :type="show1 ? 'text' : 'password'"
                                            name="input-10-1"
                                            label="Password"
                                            :rules="[rules.required, rules.min, rules.complexity]"
                                            hint="Must be the same as when you created this user !"
                                            counter
                                            @click:append="show1 = !show1"
                                    ></v-text-field>
                                </v-row>
                            </v-container>
                        </v-form>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" text @click="importDialog = false">Cancel</v-btn>
                            <v-btn color="green darken-1" text @click="importUser()">Import</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
        </v-container>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Users} from '@/store/modules/users.store';
    import {User} from '@/types';

    export default Vue.extend({
        data() {
            return {
                snackbar: false,
                text: 'The exported data for your user has been copied to your clipboard !',
                timeout: 5000,
                createAccountDialog: {},
                exportDialog: {},
                deleteDialog: {},
                createDialog: false,
                importDialog: false,
                password: "",
                username: "",
                privateKey: "",
                userData: "",
                show1: false,
                rules: {
                    required: (value: any) => !!value || 'Required.',
                    min: (v: any) => v.length >= 8 || 'Min 8 characters',
                    complexity: (v: any) => {
                        return new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&]{8,}').test(v) || 'Must have Upper, Lower, Numbers and Symbols !'
                    },
                }
            }
        },
        methods: {
            navigate(user: string) {
                this.$router.push({path: `/accounts/${user}`})
            },
            async exportUser(user: string) {
                const ctx = Users.context(this.$store)
                this.$set(this.exportDialog, user, false)
                await ctx.actions.exportKeystoreUser({name: user, password: this.password} as User)
                this.password = "";
            },
            async deleteUser(user: string) {
                const ctx = Users.context(this.$store)
                this.$set(this.deleteDialog, user, false)
                console.log(`DeleteUser - ${user}`)
                await ctx.actions.deleteKeystoreUser({name: user, password: this.password})
                this.password = "";
            },
            async createUser() {
                this.createDialog = false;
                const ctx = Users.context(this.$store)
                await ctx.actions.createKeystoreUser({
                    name: this.username,
                    password: this.password,
                })
                this.password = "";
                this.username = "";
            },
            async createAccount() {
                const ctx = Users.context(this.$store)
                this.createAccountDialog = false;
                await ctx.actions.createKeystoreUser({
                    name: this.username,
                    password: this.password,
                })
                this.password = "";
                this.username = "";
            },
            async importUser() {
                const ctx = Users.context(this.$store)
                this.importDialog = false;
                await ctx.actions.importKeystoreUser({
                    name: this.username,
                    password: this.password,
                    exportData: this.userData
                });
                this.password = "";
                this.username = "";
                this.userData = "";
            },
            checkCreateUserError() {
                const ctx = Users.context(this.$store);
                return (ctx.state.error.has('createUser') && ctx.state.error.get('createUser'))
            },
            checkDeleteUserError() {
                const ctx = Users.context(this.$store);
                return (ctx.state.error.has('deleteUser') && ctx.state.error.get('deleteUser'))
            },
            checkImportUserError() {
                const ctx = Users.context(this.$store);
                return (ctx.state.error.has('importUser') && ctx.state.error.get('importUser'))
            },
            checkExportUserError() {
                const ctx = Users.context(this.$store);
                return (ctx.state.error.has('exportUser') && ctx.state.error.get('exportUser'))
            },
        },
        beforeMount() {
            const ctx = Users.context(this.$store);
            ctx.actions.fetchKeystoreUsers();
        }
    })
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    .usertable {
        max-width: 100%
    }

    .truncate {
        max-width: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
