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
                    {{ isLoading }}
                    <v-form v-if="!isLoading" class="mx-2">
                        <v-container fluid>
                            <v-row>
                                <v-text-field
                                        v-model="txId"
                                        name="input-10-1"
                                        label="Tx Id"
                                        counter
                                        @input="resetTxs"
                                ></v-text-field>
                            </v-row>
                        </v-container>
                    </v-form>
                    <v-progress-circular v-if="isLoading" color="red" indeterminate/>
                    <v-btn v-if="!isLoading" primary @click="checkTx()">Check !</v-btn>
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
                        <v-simple-table v-if="!isLoading && display" dense
                                        class="ml-5 mr-5">
                            <thead>
                            <tr>
                                <th class="text-left">Tx Id</th>
                                <th class="text-right">Status Bootstrap</th>
                                <th class="text-right">Status Other node</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="mb-4">
                                <td>{{txId}}</td>
                                <td>{{$store.state.Tools.bootstrapTxStatus}}</td>
                                <td>{{$store.state.Tools.txStatus}}</td>
                            </tr>
                            </tbody>
                        </v-simple-table>
                    </template>
                    <div v-if="!display && !checkError()">
                        Enter a txId you want to check on the box on the left .
                    </div>
                    <div v-if="isLoading">
                        Please wait while we wait for Gecko answer .
                        <v-progress-circular v-if="isLoading" color="red" indeterminate/>
                    </div>
                    <div v-if="checkError()">
                        <v-alert
                                border="bottom"
                                color="pink darken-1"
                                dark
                        >
                            {{ checkError()}}
                        </v-alert>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

</template>

<script lang="ts">
    import Vue from 'vue';
    import {mapGetters} from "vuex";

    export default Vue.extend({
        data() {
            return {
                txId: ""
            }
        },
        computed: {
            ...mapGetters("Tools", [
                'isLoading',
                'display',
                'hasError'
            ])
        },
        methods: {
            checkTx() {
                this.$store.dispatch("Tools/checkTxStatus", {bootstrapNode: false, txId: this.txId})
                this.$store.dispatch("Tools/checkTxStatus", {bootstrapNode: true, txId: this.txId})
            },
            checkError() {
                return (this.$store.state.Tools.error.has('bootstrapTxCheck') && this.$store.state.Tools.error.get('bootstrapTxCheck')) || (this.$store.state.Tools.error.has('nodeTxCheck') && this.$store.state.Tools.error.get('nodeTxCheck'))

            },
            resetTxs() {
                this.$store.commit("Tools/cleanState");
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
