<template>
    <v-container class="theme--dark lighten-5">
        <v-row>
            <v-col
                    cols="4"
                    md="5"
            >
                <v-card
                        class="mx-auto"
                        height="100%"
                        outlined
                        tile
                >
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline text--secondary">Tx Status check</v-list-item-title>
                        </v-list-item-content>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                            </template>
                            <span>Here you will be able to check the status of a Tx. The check will be done both on your node and on the bootstrap node.</span>
                        </v-tooltip>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-form v-if="!isLoading()" class="mx-2">
                        <v-container fluid>
                            <v-row>
                                <v-text-field
                                        v-model="txId"
                                        name="input-10-1"
                                        label="Tx Id"
                                        counter
                                        @click:append="show1 = !show1"
                                ></v-text-field>
                            </v-row>
                        </v-container>
                    </v-form>
                    <v-progress-circular v-if="isLoading()" color="red" indeterminate/>
                    <v-btn v-if="!isLoading()" @click="checkTx()">Check !</v-btn>
                </v-card>
            </v-col>
            <v-col
                    cols="4"
                    md="7"
            >
                <v-card class="mx-auto"
                        height="100%"
                        outlined
                        tile
                >
                    <template>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="headline text--secondary">Check result</v-list-item-title>
                            </v-list-item-content>
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                                </template>
                                <span>See here the status of your tx on the bootstrap node and your node.</span>
                            </v-tooltip>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-simple-table v-if="!isLoading() && this.$store.state.XChain.txs.length > 0" dense
                                        class="ml-5 mr-5">
                            <thead>
                            <tr>
                                <th class="text-left">Tx Id</th>
                                <th class="text-right">Status Bootstrap</th>
                                <th class="text-right">Status Other node</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(tx , index) in this.$store.state.XChain.txs" :key="index" class="mb-4">
                                <td>{{tx.txId}}</td>
                                <td>{{tx.txStatusBootstrapNode}}</td>
                                <td>{{tx.txStatusOwnNode}}</td>
                            </tr>
                            </tbody>
                            <v-btn @click="resetTxs()">Clean</v-btn>
                        </v-simple-table>
                    </template>
                    <div v-if="this.$store.state.XChain.txs.length === 0">
                        Enter a txId you want to check on the box on the left .
                    </div>
                    <div v-if="isLoading()">
                        Please wait while we wait for Gecko answer .
                        <v-progress-circular v-if="isLoading()" color="red" indeterminate/>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        components: {},
        props: {},
        data() {
            return {
                txId: "",
                show1: true,
                loadingBootstrap: false,
                loadingNode: false,
            }
        },
        methods: {
            checkTx() {
                this.loadingBootstrap = true;
                this.loadingNode = true;
                this.$store.dispatch("XChain/checkTxStatus", {ownNode: false, txId: this.txId}).then(values => {
                    this.loadingBootstrap = false;
                    this.txId = "";
                }).catch(e => {
                    console.error("Uh oh")
                });
                this.$store.dispatch("XChain/checkTxStatus", {ownNode: true, txId: this.txId}).then(values => {
                    this.loadingNode = false;
                    this.txId = "";
                }).catch(e => {
                    console.error("Uh oh")
                });
            },
            resetTxs() {
                this.$store.commit("XChain/cleanTxs");
            },
            isLoading() {
                return this.loadingBootstrap || this.loadingNode;
            }
        }
    })
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .node-status-green-background {
        background-color: green;
    }

    .node-status-red-background {
        background-color: red;
    }

    .node-status-orange-background {
        background-color: orange;
    }
</style>
