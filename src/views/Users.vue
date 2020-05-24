<template>
    <div>
        <h1>Users</h1>
        <v-simple-table>
            <thead>
            <tr>
                <th class="text-left">User</th>
                <th class="text-left">Export</th>
                <th class="text-left">Delete</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(user, index) in this.$store.state.Keystore.users" :key="index">
                <td>{{user.name}}</td>
                <td>
                    <v-dialog v-model="exportDialog" persistent max-width="290">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark v-on="on">Export</v-btn>
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
                                                    label="Normal with hint text"
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
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    {{ user.exportData }}
                </td>
                <td>
                    <v-dialog v-model="deleteDialog" persistent max-width="290">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark v-on="on">Delete</v-btn>
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
                                                label="Normal with hint text"
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
                                <v-btn color="green darken-1" text @click="deleteDialog = false">Close</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </td>
            </tr>
            </tbody>
        </v-simple-table>
        <v-dialog v-model="createDialog" persistent max-width="290">
            <template v-slot:activator="{ on }">
                <v-btn color="primary" dark v-on="on">Create user</v-btn>
            </template>
            <v-card>
                <v-card-title class="headline">Use Google's location service?</v-card-title>
                <v-form>
                    <v-container fluid>
                        <v-row>
                            <v-text-field
                                    v-model="username"
                                    name="input-10-1"
                                    label="Normal with hint text"
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
                                    label="Normal with hint text"
                                    hint="At least 8 characters"
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
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        data() {
            return {
                exportDialog: false,
                deleteDialog: false,
                createDialog: false,
                password: "",
                username: "",
                show1: false,
            }
        },
        methods: {
            exportUser(user: string) {
                this.exportDialog = false;
                this.$store.dispatch("Keystore/exportUser", {name: user, password: this.password});
                this.password = "";
            },
            deleteUser(user: string) {
                this.deleteDialog = false;
                this.$store.dispatch("Keystore/deleteUser", {name: user, password: this.password});
                this.password = "";
            },
            createUser() {
                this.createDialog = false;
                this.$store.dispatch("Keystore/createUser", {name: this.username, password: this.password});
                this.password = "";
                this.username = "";
            }
        },
        beforeMount() {
            this.$store.dispatch('Keystore/fetchUsers');
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
</style>
