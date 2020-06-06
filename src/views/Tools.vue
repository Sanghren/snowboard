<template>
    <v-container fluid class="theme--dark lighten-5">
        <div v-if="this.checkGetPAccountError() || this.checkNodeStatusError() || this.checkTxError()" width="100%" class="red--text" height="100%">
            <v-alert
                    dismissible
                    border="bottom"
                    color="pink darken-1"
                    dark
            >
                {{ this.checkGetPAccountError() || this.checkNodeStatusError() || this.checkTxError()    }}
            </v-alert>
        </div>
        <v-row dense>
            <v-col
                    xs="4"
                    sm="12"
                    md="4"
            >
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="headline text--secondary text-center">Tx Status check
                        </v-list-item-title>
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
                <v-form v-if="!this.isTxLoading" class="mx-2">
                    <v-container fluid>
                        <v-row>
                            <v-text-field
                                    v-model="txId"
                                    name="input-10-1"
                                    label="Tx Id"
                                    counter
                                    @input="reset"
                            ></v-text-field>
                        </v-row>
                    </v-container>
                </v-form>
                <v-progress-circular v-if="this.isTxLoading" color="red" indeterminate/>
                <v-container>
                    <v-row dense>
                        <v-col>
                            <v-btn v-if="!this.isTxLoading" primary @click="checkTx()">Check !</v-btn>
                        </v-col>
                        <v-col v-if=!checkTxError()>
                            <div v-if="this.displayTx" width="100%" height="100%">Bootstrap : <span
                                    :class="bootstrapTxClass()">{{$store.state.Tools.bootstrapTxStatus}}</span>
                            </div>
                        </v-col>
                        <v-col v-if=!checkTxError()>
                            <div v-if="this.displayTx" width="100%" height="100%">
                                Node : <span :class="nodeTxClass()">{{$store.state.Tools.txStatus}}</span>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
            <v-col
                    xs="4"
                    sm="12"
                    md="4"
                    secondary>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="headline text-center text--secondary">Node Validator Status
                        </v-list-item-title>
                    </v-list-item-content>
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                        </template>
                        <span>Here you can check what is the status of your node (Validating, Pending, ...).</span>
                    </v-tooltip>
                </v-list-item>
                <v-divider></v-divider>
                <v-form v-if="!this.isNodeStatusLoading" class="mx-2">
                    <v-container fluid>
                        <v-row dense>
                            <v-text-field
                                    v-model="nodeId"
                                    name="input-10-1"
                                    label="Node Id"
                                    counter
                                    @input="reset"
                            ></v-text-field>
                        </v-row>
                    </v-container>
                </v-form>
                <v-progress-circular v-if="this.isNodeStatusLoading" color="red" indeterminate/>
                <v-container>
                    <v-row dense>
                        <v-col>
                            <v-btn v-if="!this.isNodeStatusLoading" primary @click="checkNodeStatus()">Check !</v-btn>
                        </v-col>
                        <v-spacer/>
                        <v-col v-if=!checkNodeStatusError()>
                            <div disabled width="100%" height="100%">
                                <span :class="nodeTxClass()">{{$store.state.Tools.nodeStatus}}</span>
                            </div>
                        </v-col>
                        <v-col v-if=checkNodeStatusError()>
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
            <v-col
                    xs="4"
                    sm="12"
                    md="4"
                    secondary>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="headline text-center text--secondary">P-Chain Account Info
                        </v-list-item-title>
                    </v-list-item-content>
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                        </template>
                        <span>Enter here your P-Chain account, and it will give you back information like balance/nonce</span>
                    </v-tooltip>
                </v-list-item>
                <v-divider></v-divider>
                <v-form v-if="!this.isGetAccountLoading" class="mx-2">
                    <v-container fluid>
                        <v-row dense>
                            <v-text-field
                                    v-model="pAddress"
                                    name="input-10-1"
                                    label="P Address"
                                    counter
                                    @input="reset"
                            ></v-text-field>
                        </v-row>
                    </v-container>
                </v-form>
                <v-progress-circular v-if="this.isGetAccountLoading" color="red" indeterminate/>
                <v-container>
                    <v-row dense>
                        <v-col>
                            <v-btn v-if="!this.isGetAccountLoading" primary @click="getPAccount()">Check !</v-btn>
                        </v-col>
                        <v-spacer/>
                        <v-col v-if=!checkGetPAccountError()>
                            <div disabled v-if="$store.state.Tools.pAccount.address.length > 0" width="100%" height="100%">
                                Address :<span>{{$store.state.Tools.pAccount.address}}</span><br/>
                                Nonce :<span>{{$store.state.Tools.pAccount.nonce}}</span><br/>
                                Balance :<span>{{$store.state.Tools.pAccount.balance}}</span>
                            </div>
                        </v-col>
                        <v-col v-if=checkGetPAccountError()>
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {ToolsMapper, Tools} from '@/store/modules/tools.store'


    export default Vue.extend({
        data() {
            return {
                txId: "",
                nodeId: "",
                pAddress: ""
            }
        },
        computed:
            ToolsMapper.mapGetters(
                [
                    'isTxLoading',
                    'isNodeStatusLoading',
                    'isGetAccountLoading',
                    'displayPAccount',
                    'displayTx',
                    'getErrors',
                    'displayNodeStatus',
                    'hasError'
                ]
            ),
        methods: {
            checkTx() {
                const ctx = Tools.context(this.$store);
                ctx.actions.checkTxStatus({bootstrapNode: false, txId: this.txId})
                ctx.actions.checkTxStatus({bootstrapNode: true, txId: this.txId})
            },
            checkNodeStatus() {
                const ctx = Tools.context(this.$store);
                ctx.actions.checkNodeStatus(this.nodeId)
            },
            async getPAccount() {
                const ctx = Tools.context(this.$store);
                await ctx.actions.getAccount(this.pAddress)
                this.pAddress = ""
            },
            checkTxError() {
                const ctx = Tools.context(this.$store);
                return (ctx.state.error.has('bootstrapTxCheck') && ctx.state.error.get('bootstrapTxCheck')) || (ctx.state.error.has('nodeTxCheck') && ctx.state.error.get('nodeTxCheck'))
            },
            checkNodeStatusError() {
                const ctx = Tools.context(this.$store);
                return (ctx.state.error.has('bootstrapTxCheck') && ctx.state.error.get('bootstrapTxCheck')) || (ctx.state.error.has('nodeTxCheck') && ctx.state.error.get('nodeTxCheck'))
            },
            checkGetPAccountError() {
                const ctx = Tools.context(this.$store);
                return (ctx.state.error.has('getAccount') && ctx.state.error.get('getAccount'))
            },
            reset() {
                const ctx = Tools.context(this.$store);
                ctx.mutations.cleanState();
            },
            bootstrapTxClass() {
                let color = "";
                if (this.checkTxError()) {
                    color = "node-status-red-text-color";
                } else if (this.$store.state.Tools.txStatus === 'Invalid') {
                    color = "node-status-red-text-color";
                } else if (this.$store.state.Tools.txStatus === 'Accepted') {
                    color = "node-status-green-text-color"
                } else if (this.$store.state.Tools.txStatus === 'Unknown') {
                    color = "node-status-orange-text-color"
                } else {
                    //
                }
                return color;
            },
            nodeTxClass() {
                let color = "";
                if (this.checkTxError()) {
                    color = "node-status-red-text-color";
                } else if (this.$store.state.Tools.txStatus === 'Invalid') {
                    color = "node-status-red-text-color";
                } else if (this.$store.state.Tools.txStatus === 'Accepted') {
                    color = "node-status-green-text-color"
                } else if (this.$store.state.Tools.txStatus === 'Unknown') {
                    color = "node-status-orange-text-color"
                } else {
                    //
                }
                return color;
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

    .node-status-green-text-color {
        color: green;
    }

    .node-status-red-text-color {
        color: red;
    }

    .node-status-orange-text-color {
        color: orange;
    }
</style>
