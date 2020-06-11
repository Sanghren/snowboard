<template>
    <v-container fill-height fluid>
        <v-snackbar
                v-model="snackbarCChainPrivateKey"
        >
            <v-btn
                    v-model="xAddressPKey"
                    color="blue"
                    text
                    v-clipboard:copy="xAddressPKey"
            >
                Copy PKey
            </v-btn>
            <v-btn
                    color="blue"
                    text
                    v-clipboard:copy="xAddressPKey"
                    @click="snackbarCChainPrivateKey = false"
            >
                Close
            </v-btn>
        </v-snackbar>
        <v-snackbar
                v-model="snackbarPChainPrivateKey"
        >
            <v-btn
                    v-model="pAddressPKey"
                    color="blue"
                    text
                    v-clipboard:copy="pAddressPKey"
            >
                Copy PKey
            </v-btn>
            <v-btn
                    color="blue"
                    text
                    @click="snackbarPChainPrivateKey = false"
            >
                Close
            </v-btn>
        </v-snackbar>
        <v-row dense>
            <v-col>
                <h2 class="text-center">Managing XChain/PChain information for <span
                        class="font-weight-black text--secondary">{{ id }}</span></h2>
                <v-dialog v-model="loginDialog" persistent max-width="290">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark small text class="ml-1" v-on="on">Login</v-btn>
                    </template>
                    <v-card>
                        <v-card-title class="headline">Enter your password for the Keystore's user {{ id }}
                        </v-card-title>
                        <v-form>
                            <v-container fluid>
                                <v-row>
                                    <v-text-field
                                            v-model="password"
                                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                            :type="show1 ? 'text' : 'password'"
                                            name="input-10-1"
                                            label="Password"
                                            hint="At least 8 characters"
                                            counter
                                            @click:append="show1 = !show1"
                                    ></v-text-field>
                                </v-row>
                            </v-container>
                        </v-form>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" text @click="fetchXChainInfo()">Login</v-btn>
                            <v-btn color="green darken-1" text @click="loginDialog = false">
                                Close
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-btn color="primary" dark small text @click="fetchXChainInfo()">Refresh</v-btn>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col
                    md="5"
            >
                <v-sheet
                        height="100%"
                        dark
                >
                    <v-slide-group
                            v-model="xAddress"
                            center-active
                    >
                        <v-slide-item
                                v-for="(cAddress, index) in $store.state.Account.xAddresses"
                                :key="index"
                                v-slot:default="{ active, toggle }"
                        >
                            <v-card
                                    :color="active ? 'secondary' : 'grey lighten-1'"
                                    class="ma-3"
                                    height="100%"
                                    @click="toggle"
                                    :key="index"
                            >
                                <v-list-item three-line>
                                    <v-list-item-content>
                                        <div class="overline mb-4">X-Address</div>
                                        <v-list-item-subtitle>{{ cAddress.address }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                    <div v-for="(item, index) in $store.state.Account.xAddresses">
                                        <div v-if="item.address === cAddress.address">
                                            <div v-for="(asset, assetIndex) in item.assets">
                                            </div>
                                            <div v-html="item.identicon"/>
                                        </div>
                                    </div>
                                </v-list-item>

                                <v-card-text>
                                    <p class="display-1 text-center text--primary">
                                        Balance(s)
                                    </p>
                                    <div v-for="(item, index) in $store.state.Account.xAddresses">
                                        <div v-if="item.address === cAddress.address">
                                            <div v-if="item.assets.length === 0" class="text-center">
                                                This address does not have any assets.
                                            </div>
                                            <div v-else v-for="(asset, assetIndex) in item.assets">
                                                <div v-if="asset.balance === -1" class="text-center">
                                                    You need to fetch the balance first .
                                                </div>
                                                <div v-else>
                                                    {{ asset.asset }} || {{ asset.balance }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!--                                    <div v-if="$store.state.Account.xAddressBalance.length ===  0">-->
                                    <!--                                        You dont have any assets on this address-->
                                    <!--                                    </div>-->
                                </v-card-text>
                                <v-card-actions>
                                    <v-dialog v-model="exportXAddressDialog[cAddress.address]" persistent
                                              max-width="290">
                                        <template v-slot:activator="{ on }">
                                            <v-btn color="primary" dark small text v-on="on"
                                                   @click="cChainPrivateKey = true">Export
                                            </v-btn>
                                        </template>
                                        <v-card>
                                            <v-card-title class="headline">Export the private key controlling this
                                                address
                                            </v-card-title>
                                            <v-card-text>
                                                <v-form>
                                                    <v-container fluid>
                                                        <v-row>
                                                            <v-text-field
                                                                    v-model="exportPassword"
                                                                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                                                    :type="show1 ? 'text' : 'password'"
                                                                    name="input-10-1"
                                                                    label="Password"
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
                                                <v-btn color="green darken-1" text
                                                       @click="exportXAddress(cAddress.address)">Export
                                                </v-btn>
                                                <v-btn color="green darken-1" text
                                                       @click="$set(exportXAddressDialog, cAddress.address, false)">
                                                    Close
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                    <v-btn color="primary" dark small text :disabled="xAddress < 0"
                                           @click="fetchBalances(cAddress.address)">
                                        Balances
                                    </v-btn>
                                </v-card-actions>
                                <v-row
                                        class="fill-height"
                                        align="center"
                                        justify="center"
                                >
                                </v-row>
                            </v-card>
                        </v-slide-item>
                    </v-slide-group>
                </v-sheet>
                <v-row justify="center">
                    <v-dialog v-model="importXAddressDialog" persistent max-width="290">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark small text v-on="on">Import</v-btn>
                        </template>
                        <v-card>
                            <v-card-title class="headline">Import an address by passing the private key
                                controlling this
                                address
                            </v-card-title>
                            <v-card-text>
                                <v-form>
                                    <v-container fluid>
                                        <v-row>
                                            <v-text-field
                                                    v-model="exportPassword"
                                                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                                    :type="show1 ? 'text' : 'password'"
                                                    name="input-10-1"
                                                    label="Password"
                                                    hint="At least 8 characters"
                                                    counter
                                                    @click:append="show1 = !show1"
                                            ></v-text-field>
                                        </v-row>
                                        <v-row>
                                            <v-text-field
                                                    v-model="xAddressPKeyImport"
                                                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                                    :type="show1 ? 'text' : 'password'"
                                                    name="input-10-1"
                                                    label="Private key"
                                                    counter
                                                    @click:append="show1 = !show1"
                                            ></v-text-field>
                                        </v-row>
                                    </v-container>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" text @click="importXAddress()">Import</v-btn>
                                <v-btn color="green darken-1" text @click="importXAddressDialog = false">
                                    Close
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-btn dark small text @click="createAddress()">Create new address</v-btn>
                </v-row>
            </v-col>
            <v-flex
                    :class="`d-flex align-center mb-6`"
            >
                <v-col md="1">
                    <v-row dense align="center">
                        <v-btn color="primary" dark small text>To PChain</v-btn>
                    </v-row>
                </v-col>
            </v-flex>
            <v-flex
                    :class="`d-flex align-center mb-6`"
            >
                <v-col
                        md="1">
                    <v-row dense align="center">
                        <v-btn color="primary" dark small text>To XChain</v-btn>
                    </v-row>
                </v-col>
            </v-flex>
            <v-col
                    md="5"
                    no-gutters
            >
                <v-sheet
                        height="100%"
                >
                    <v-slide-group
                            center-active
                            show-arrows
                    >
                        <v-slide-item
                                v-for="(pAccount, index) in  $store.state.Account.pAccounts"
                                :key="index"
                                v-slot:default="{ active, toggle }"
                        >
                            <v-card
                                    :color="active ? 'secondary' : 'grey lighten-1'"
                                    class="ma-3"
                                    height="100%"
                                    @click="toggle"
                            >
                                <v-list-item three-line>
                                    <div v-for="(item, index) in $store.state.Account.pAccounts">
                                        <div v-if="item.address === pAccount.address">
                                            <div v-html="item.identicon"/>
                                        </div>
                                    </div>
                                    <v-list-item-content>
                                        <div class="overline text-right mb-4">P-Address</div>
                                        <v-list-item-subtitle class="text-right">{{ pAccount.address }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-card-text>
                                    <p class="display-1 text-center text--primary">
                                        Balance
                                    </p>
                                    Nonce : {{ pAccount.nonce }} <br/>
                                    Balance : {{ pAccount.balance }}
                                </v-card-text>
                                <v-card-actions>
                                    <v-dialog v-model="exportPAddressDialog[pAccount.address]" persistent
                                              max-width="290">
                                        <template v-slot:activator="{ on }">
                                            <v-btn color="primary" dark small text v-on="on"
                                                   @click="pChainPrivateKey = true">Export
                                            </v-btn>
                                        </template>
                                        <v-card>
                                            <v-card-title class="headline">Export the private key controlling this
                                                address
                                            </v-card-title>
                                            <v-card-text>
                                                <v-form>
                                                    <v-container fluid>
                                                        <v-row>
                                                            <v-text-field
                                                                    v-model="exportPassword"
                                                                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                                                    :type="show1 ? 'text' : 'password'"
                                                                    name="input-10-1"
                                                                    label="Password"
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
                                                <v-btn color="green darken-1" text
                                                       @click="exportPAddress(pAccount.address)">Export
                                                </v-btn>
                                                <v-btn color="green darken-1" text
                                                       @click="$set(exportPAddressDialog, pAccount.address, false)">
                                                    Close
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                    <v-btn color="primary" dark small text :disabled="xAddress < 0"
                                           @click="fetchBalances(pAccount.address)">
                                        Balances
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-slide-item>
                    </v-slide-group>
                </v-sheet>
                <v-row justify="center">
                    <v-btn dark small text @click="importPAccountKey()">Import PKey</v-btn>
                    <v-btn dark small text @click="createPAccount()">Create new account</v-btn>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Account} from "@/store/modules/account.store";
    import {PAddressExport, PAddressImport, User, XAddressExport, XAddressImport, XChainAddress} from "@/types";
    import DoughnutChart from "@/components/DoughnutChart.vue";

    export default Vue.extend({
        components: {DoughnutChart},
        props: ['id'],
        data() {
            return {
                password: "",
                exportPassword: "",
                snackbarCChainPrivateKey: false,
                snackbarPChainPrivateKey: false,
                xAddressPKey: "",
                pAddressPKey: "",
                xAddressPKeyImport: "",
                xAddress: -1,
                cChainPrivateKey: false,
                pChainPrivateKey: false,
                cChainPrivateKeyTimeout: 5000,
                pChainPrivateKeyTimeout: 5000,
                exportXAddressDialog: {},
                importXAddressDialog: false,
                exportPAddressDialog: {},
                importPAddressDialog: false,
                show1: false,
                loginDialog: false,
                rules: {
                    required: (value: any) => !!value || 'Required.',
                    min: (v: any) => v.length >= 8 || 'Min 8 characters',
                    complexity: (v: any) => {
                        return new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&]{8,}').test(v) || 'Must have Upper, Lower, Numbers and Symbols !'
                    },
                }
            }
        },
        mounted() {
            // this.fetchXChainInfo()
        },
        methods: {
            async fetchXChainInfo() {
                const accountCtx = Account.context(this.$store)
                this.loginDialog = false;
                await accountCtx.actions.listXAddresses({name: this.id, password: this.password} as User)
                await accountCtx.actions.listPAccounts({name: this.id, password: this.password} as User)
            },
            async fetchBalances(address: string) {
                const accountCtx = Account.context(this.$store)
                const xAddress = accountCtx.state.xAddresses.find((item: XChainAddress) => item.address == address)
                if (!xAddress) {
                    return -1;
                }
                await accountCtx.actions.getBalances(xAddress.address);
            },
            async createAddress() {
                const accountCtx = Account.context(this.$store)
                await accountCtx.actions.createXAddresse({name: this.id, password: this.password} as User);
            },
            resetBalance() {
                this.xAddress = -1;
            },
            async importXAddress() {
                const accountCtx = Account.context(this.$store)
                this.importXAddressDialog = false
                await accountCtx.actions.importXAddress({
                    name: this.id,
                    password: this.exportPassword,
                    privateKey: this.xAddressPKeyImport
                } as XAddressImport);
                this.exportPassword = ""
            },
            async exportXAddress(address: string) {
                const accountCtx = Account.context(this.$store)
                this.$set(this.exportXAddressDialog, address, false)
                this.xAddressPKey = await accountCtx.actions.exportXAddress({
                    name: this.id,
                    password: this.exportPassword,
                    address
                } as XAddressExport);
                this.exportPassword = "";
                this.snackbarCChainPrivateKey = true;
            },
            async exportPAddress(address: string) {
                const accountCtx = Account.context(this.$store)
                this.$set(this.exportPAddressDialog, address, false)
                this.pAddressPKey = await accountCtx.actions.exportPAccountKey({
                    name: this.id,
                    password: this.exportPassword,
                    address
                } as PAddressExport);
                this.exportPassword = "";
                this.snackbarPChainPrivateKey = true;
            },
            async createPAccount() {
                const accountCtx = Account.context(this.$store)
                await accountCtx.actions.createPAccount({name: this.id, password: this.password} as User);
            },
            async exportPAccountKey(address: string) {
                const accountCtx = Account.context(this.$store)
                await accountCtx.actions.exportPAccountKey({
                    name: this.id,
                    password: this.password,
                    address
                } as PAddressExport);
            },
            async importPAccountKey(privateKey: string) {
                const accountCtx = Account.context(this.$store)
                await accountCtx.actions.importPAccountKey({
                    name: this.id,
                    password: this.password,
                    privateKey
                } as PAddressImport);
            },
            async login() {
                this.loginDialog = false;
            }
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
