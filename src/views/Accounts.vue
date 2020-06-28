<template>
    <v-container fluid>
        <v-snackbar
                v-model="snackbarXChainPrivateKey"
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
                    @click="snackbarXChainPrivateKey = false"
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
        <v-alert
                :value="checkVuexError"
                dismissible
                border="bottom"
                color="pink darken-1"
                dark
        >
            {{ displayError }}
        </v-alert>
        <v-row dense>
            <v-col>
                <v-dialog v-if="!loggedIn" v-model="loginDialog" persistent max-width="290">
                    <template v-slot:activator="{ on }">
                        <v-btn class="ml-1" rounded v-on="on">Login</v-btn>
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
                            <v-btn color="green darken-1" text @click="login()">Login</v-btn>
                            <v-btn color="green darken-1" text @click="loginDialog = false">
                                Close
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-btn v-if="loggedIn" rounded @click="logout()">Logout</v-btn>
                <v-btn rounded class="ml-3" @click="fetchXChainInfo()">Refresh</v-btn>
                <h2 class="text-center">Managing XChain/PChain information for <span
                        class="font-weight-black text--secondary">{{ id }}</span>
                    <v-tooltip top>
                        <template
                                v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons md14">
                                    help_outline
                                </span>
                        </template>
                        <span>Show the X Addresses and P Accounts associated to this user. You need to login first .</span>
                    </v-tooltip>
                </h2>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col
                    md="5"
            >
                <v-sheet
                        height="100%"
                >
                    <v-slide-group
                            v-model="xAddressIndex"
                            center-active
                    >
                        <v-slide-item
                                v-if="$store.state.Account.loading.has('listXAddresses') && !$store.state.Account.loading.get('listXAddresses')"
                                v-for="(xAddress, index) in $store.state.Account.xAddresses"
                                :key="index"
                                v-slot:default="{ active, toggle }"
                        >
                            <v-card
                                    color="secondary"
                                    class="ma-3"
                                    height="100%"
                                    @click="toggle"
                                    :key="index"
                            >
                                <v-list-item three-line>
                                    <v-list-item-content>
                                        <div class="overline mb-4">X-Address</div>
                                        <v-list-item-subtitle>{{ xAddress.address }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                    <div v-for="(item) in $store.state.Account.xAddresses">
                                        <div v-if="item.address === xAddress.address">
                                            <div v-html="item.identicon"/>
                                        </div>
                                    </div>
                                </v-list-item>
                                <v-card-text>
                                    <p class="display-1 text-center text--secondary">
                                        Balance(s)
                                    </p>
                                    <div v-for="(item, index) in $store.state.Account.xAddresses">
                                        <div v-if="item.address === xAddress.address">
                                            <div v-if="item.assets.length === 0" class="text-center">
                                                This address does not have any assets.
                                            </div>
                                            <div v-else v-for="(asset) in item.assets">
                                                <div v-if="asset.balance === -1" class="text-center">
                                                    You need to fetch the balance first .
                                                </div>
                                                <div class="text-center text--primary" v-else>
                                                    {{ asset.balance }} nAVAX
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </v-card-text>
                                <v-card-actions>
                                    <v-dialog v-model="exportXAddressDialog[xAddress.address]" persistent
                                              max-width="290">
                                        <template v-slot:activator="{ on }">
                                            <v-btn rounded v-on="on"
                                                   @click="cChainPrivateKey = true"
                                                   :disabled="!active"
                                            >
                                                Export
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
                                                <v-btn rounded
                                                       @click="exportXAddress(xAddress.address)">Export
                                                </v-btn>
                                                <v-btn rounded
                                                       @click="$set(exportXAddressDialog, xAddress.address, false)">
                                                    Close
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-card-actions>
                                <v-row
                                        class="fill-height"
                                        align="center"
                                        justify="center"
                                >
                                </v-row>
                            </v-card>
                        </v-slide-item>
                        <div v-if="$store.state.Account.loading.has('listXAddresses') && $store.state.Account.loading.get('listXAddresses')"
                        >
                            <v-progress-circular
                                    indeterminate
                                    color="red"
                            ></v-progress-circular>
                        </div>
                    </v-slide-group>
                </v-sheet>
                <v-row justify="center">
                    <v-dialog v-model="importXAddressDialog" persistent max-width="290">
                        <template v-slot:activator="{ on }">
                            <v-btn rounded class="mt-1" v-on="on">Import</v-btn>
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
                                <v-btn rounded class="mt-1" @click="importXAddress()">Import</v-btn>
                                <v-btn rounded class="mt-1 ml-1" @click="importXAddressDialog = false">
                                    Close
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-btn rounded class="mt-1 ml-1" @click="createAddress()">Create new address</v-btn>
                </v-row>
            </v-col>
            <v-flex
                    :class="`d-flex align-center mb-6`"
            >
                <v-col md="1">
                    <v-row dense align="center">
                        <v-btn rounded @click="dialog = true">To PChain</v-btn>
                    </v-row>
                </v-col>
            </v-flex>
            <v-flex
                    :class="`d-flex align-center mb-6`"
            >
                <v-col
                        md="1">
                    <v-row dense align="center">
                        <v-btn rounded @click="pChainToXChainDialog = true">To XChain</v-btn>
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
                            v-model="pAccountIndex"
                            center-active
                    >
                        <v-slide-item
                                v-if="$store.state.Account.loading.has('listPAccounts') && !$store.state.Account.loading.get('listPAccounts')"
                                v-for="(pAccount, index) in  $store.state.Account.pAccounts"
                                :key="index"
                                v-slot:default="{ active, toggle }"
                        >
                            <v-card
                                    color="secondary"
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
                                    <p class="text-center text--primary">
                                        Nonce : {{ pAccount.nonce }} <br/>
                                        {{ pAccount.balance }} nAVAX
                                    </p>
                                </v-card-text>
                                <v-card-actions>
                                    <v-dialog v-model="exportPAddressDialog[pAccount.address]" persistent
                                              max-width="290">
                                        <template v-slot:activator="{ on }">
                                            <v-btn rounded v-on="on"
                                                   @click="pChainPrivateKey = true"
                                                   :disabled="!active"
                                            >
                                                Export
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
                                                <v-btn rounded
                                                       @click="exportPAddress(pAccount.address)">Export
                                                </v-btn>
                                                <v-btn rounded
                                                       @click="$set(exportPAddressDialog, pAccount.address, false)">
                                                    Close
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-card-actions>
                            </v-card>
                        </v-slide-item>
                        <div
                                v-if="$store.state.Account.loading.has('listPAccounts') && $store.state.Account.loading.get('listPAccounts')"
                        >
                            <v-progress-circular
                                    indeterminate
                                    color="red"
                            ></v-progress-circular>
                        </div>
                    </v-slide-group>
                </v-sheet>
                <v-row justify="center">
                    <v-btn rounded class="mt-1" @click="importPAccountKey()">Import PKey</v-btn>
                    <v-btn rounded class="mt-1 ml-1" @click="createPAccount()">Create new account</v-btn>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-dialog
                        v-if="pAccountIndex > -1 && xAddressIndex > -1"
                        v-model="dialog"
                        hide-overlay
                        width="100%"
                        transition="dialog-bottom-transition"
                        scrollable
                >
                    <v-stepper
                            v-model="toPStepper"
                    >
                        <v-stepper-header>
                            <v-stepper-step step="1">Export AVA to PChain</v-stepper-step>

                            <v-divider></v-divider>

                            <v-stepper-step step="2">Import AVA from XChain</v-stepper-step>

                            <v-divider></v-divider>

                            <v-stepper-step step="3">Issue Tx</v-stepper-step>

                            <v-divider></v-divider>

                            <v-stepper-step step="4">Poll Tx Status</v-stepper-step>
                        </v-stepper-header>
                        <v-stepper-items>
                            <v-stepper-content step="1">
                                <v-container>
                                    <v-row>
                                        <v-col>
                                            <v-row>
                                                <v-col>
                                                    From {{ $store.state.Account.xAddresses[xAddressIndex].address }}
                                                </v-col>
                                                <v-col>
                                                    <div v-html="$store.state.Account.xAddresses[xAddressIndex].identicon"/>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                        <v-col>
                                            <v-row>
                                                <v-col>
                                                    <div v-html="$store.state.Account.pAccounts[pAccountIndex].identicon"/>
                                                </v-col>
                                                <v-col>
                                                    To {{ $store.state.Account.pAccounts[pAccountIndex].address }}
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-slider
                                                v-model="xExportSlider"
                                                class="align-center"
                                                :max="$store.state.Account.xAddresses[xAddressIndex].assets.find(e => e.asset === 'AVA').balance"
                                                :min="0"
                                                hide-details
                                        >
                                            <template v-slot:append>
                                                <v-text-field
                                                        v-model="xExportSlider"
                                                        class="mt-0 pt-0"
                                                        hide-details
                                                        single-line
                                                        type="number"
                                                        style="width: 60px"
                                                ></v-text-field>
                                            </template>
                                        </v-slider>
                                    </v-row>
                                    <v-row>
                                        Username : {{ id }}
                                    </v-row>
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
                                    <v-row>
                                        <v-btn
                                                @click="exportAvaToPChain($store.state.Account.pAccounts[pAccountIndex].address)">
                                            Next
                                        </v-btn>
                                    </v-row>
                                </v-container>
                            </v-stepper-content>
                            <v-stepper-content step="2">
                                <v-container>
                                    <v-row>
                                        <v-col>
                                            <span class="text-center">{{ $store.state.Account.txId }}</span>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-progress-circular indeterminate
                                                                 v-if="$store.state.Account.txStatus !== 'Accepted'"></v-progress-circular>
                                            <span class="text-center">{{ $store.state.Account.txStatus }}</span>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-btn
                                                color="primary"
                                                :disabled="$store.state.Account.txStatus !== 'Accepted'"
                                                @click="toPStepper = 3"
                                        >
                                            Next
                                        </v-btn>
                                    </v-row>
                                </v-container>
                            </v-stepper-content>
                            <v-stepper-content step="3">
                                <v-container>
                                    <v-row>
                                        <v-col>
                                            <v-row>
                                                <v-col>
                                                    From {{ $store.state.Account.xAddresses[xAddressIndex].address }}
                                                </v-col>
                                                <v-col>
                                                    <div v-html="$store.state.Account.xAddresses[xAddressIndex].identicon"/>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                        <v-col>
                                            <v-row>
                                                <v-col>
                                                    <div v-html="$store.state.Account.pAccounts[pAccountIndex].identicon"/>
                                                </v-col>
                                                <v-col>
                                                    To {{ $store.state.Account.pAccounts[pAccountIndex].address }}
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        Nonce : {{ $store.state.Account.pAccounts[pAccountIndex].nonce }}
                                    </v-row>
                                    <v-row>
                                        Username : {{ id }}
                                    </v-row>
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
                                    <v-row>
                                        <v-btn
                                                @click="importAvaFromXChain($store.state.Account.pAccounts[pAccountIndex].address, $store.state.Account.pAccounts[pAccountIndex].nonce)">
                                            Export AVA
                                        </v-btn>
                                    </v-row>
                                </v-container>
                                <v-btn text
                                       @click="importAvaFromXChain($store.state.Account.pAccounts[pAccountIndex].address, $store.state.Account.pAccounts[pAccountIndex].nonce)">
                                </v-btn>
                            </v-stepper-content>
                            <v-stepper-content step="4">
                                <v-row>
                                    <v-col>
                                        The transfer from your XChain account to your PChain account is done.
                                    </v-col>
                                </v-row>
                            </v-stepper-content>
                        </v-stepper-items>
                        <v-btn @click="closeDialog()">Close</v-btn>
                    </v-stepper>
                </v-dialog>
                <v-dialog
                        v-if="pAccountIndex > -1 && xAddressIndex > -1"
                        v-model="pChainToXChainDialog"
                        hide-overlay
                        width="100%"
                        transition="dialog-bottom-transition"
                        scrollable
                >
                    <v-stepper
                            v-model="toXStepper"
                    >
                        <v-stepper-header>
                            <v-stepper-step step="1">Export AVA to XChain</v-stepper-step>

                            <v-divider></v-divider>

                            <v-stepper-step step="2">Sign Tx</v-stepper-step>

                            <v-divider></v-divider>

                            <v-stepper-step step="3">Issue Tx</v-stepper-step>

                            <v-divider></v-divider>

                            <v-stepper-step step="4">Poll Tx Status</v-stepper-step>
                            <v-divider></v-divider>

                            <v-stepper-step step="5">Poll Tx Status</v-stepper-step>
                        </v-stepper-header>

                        <v-stepper-items>
                            <v-stepper-content step="1">
                                <v-container>
                                    <v-row>
                                        <v-col>
                                            <v-row>
                                                <v-col>
                                                    From {{ $store.state.Account.pAccounts[pAccountIndex].address }}
                                                </v-col>
                                                <v-col>
                                                    <div v-html="$store.state.Account.pAccounts[pAccountIndex].identicon"/>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                        <v-col>
                                            <v-row>
                                                <v-col>
                                                    <div v-html="$store.state.Account.xAddresses[xAddressIndex].identicon"/>
                                                </v-col>
                                                <v-col>
                                                    To {{ $store.state.Account.xAddresses[xAddressIndex].address }}
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-slider
                                                v-model="pExportSlider"
                                                class="align-center"
                                                :max="$store.state.Account.pAccounts[pAccountIndex].balance"
                                                :min="0"
                                                hide-details
                                        >
                                            <template v-slot:append>
                                                <v-text-field
                                                        v-model="pExportSlider"
                                                        class="mt-0 pt-0"
                                                        hide-details
                                                        single-line
                                                        type="number"
                                                        style="width: 60px"
                                                ></v-text-field>
                                            </template>
                                        </v-slider>
                                    </v-row>
                                    <v-row>
                                        Nonce : {{ $store.state.Account.pAccounts[pAccountIndex].nonce }}
                                    </v-row>
                                    <v-row>
                                        <v-btn text
                                               @click="exportAvaToXChain($store.state.Account.xAddresses[xAddressIndex].address,  $store.state.Account.pAccounts[pAccountIndex].nonce)">
                                            Export AVA
                                        </v-btn>
                                    </v-row>
                                </v-container>
                            </v-stepper-content>
                            <v-stepper-content step="2">
                                <v-row>
                                    {{ $store.state.Account.txId }}
                                </v-row>
                                <v-row>
                                    {{ $store.state.Account.txStatus }}
                                </v-row>
                                <v-row>
                                    <v-btn
                                            color="primary"
                                            @click="signTx($store.state.Account.txId , $store.state.Account.pAccounts[pAccountIndex].address)"
                                    >
                                        Sign Tx
                                    </v-btn>
                                </v-row>
                            </v-stepper-content>
                            <v-stepper-content step="3">
                                <v-container>
                                    <v-row>
                                        <v-col>
                                            <v-row>
                                                <v-col>
                                                    We will now issue the Transaction .
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-btn text
                                               @click="issueTx()">
                                            Issue Tx
                                        </v-btn>
                                    </v-row>
                                </v-container>
                            </v-stepper-content>
                            <v-stepper-content step="4">
                                <v-container>
                                    <v-row>
                                        <v-col>
                                            <v-row>
                                                <v-col>
                                                    Issue Tx
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-btn text
                                               @click="importAvaFromPChain($store.state.Account.xAddresses[xAddressIndex].address)">
                                            Import AVA From P Chain
                                        </v-btn>
                                    </v-row>
                                </v-container>
                                <v-btn text
                                       @click="importAvaFromPChain($store.state.Account.xAddresses[xAddressIndex].address)">

                                    Cancel
                                </v-btn>
                            </v-stepper-content>
                            <v-stepper-content step="5">
                                <v-row>
                                    <v-col>
                                        <span class="text-center">{{ $store.state.Account.txId }}</span>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-progress-circular indeterminate
                                                             v-if="$store.state.Account.txStatus !== 'Accepted'"></v-progress-circular>
                                        <span class="text-center">{{ $store.state.Account.txStatus }}</span>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-btn
                                            color="primary"
                                            :disabled="$store.state.Account.txStatus !== 'Accepted'"
                                            @click="toPStepper = 6"
                                    >
                                        Next
                                    </v-btn>
                                </v-row>
                            </v-stepper-content>
                            <v-stepper-content step="6">
                                <v-row>
                                    <v-col>
                                        You have successfully transferred some AVA from your PChain account to your
                                        XAddress
                                        .
                                    </v-col>
                                </v-row>
                            </v-stepper-content>
                        </v-stepper-items>
                        <v-btn @click="closeDialog()">Close</v-btn>
                    </v-stepper>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row class="mt-10">
            <v-col class="text-center subtitle-2">
                Staking
            </v-col>
        </v-row>
        <v-row>
            <v-col v-if="loggedIn">
                <v-row>
                    <v-col
                            sm="12"
                            md="3"
                    >
                        <v-select
                                v-model="selectedSubnet"
                                :items="subnetIds"
                                label="Subnet"
                                @change="fetchInfo()"
                                dense
                                class="text-center"
                        ></v-select>
                    </v-col>
                </v-row>
                <v-row v-if="fetchCurrentSubnetValidatingStatus() !== undefined">
                    <v-col
                            xs="12"
                            md="6"
                            class="text-center"
                    >
                        <span v-if="isOwnAddress()">Your are currently validating this subnet !</span>
                        <span v-else>This node is currently validating this subnet .</span>
                    </v-col>
                    <v-col
                            xs="12"
                            md="6"
                            class="text-center"
                    >
                        Start : <br/> {{ new Date(fetchCurrentSubnetValidatingStatus().startTime * 1000) }}
                    </v-col>
                    <v-col
                            xs="12"
                            md="6"
                            class="text-center"
                    >
                        End : <br/> {{ new Date(fetchCurrentSubnetValidatingStatus().endTime * 1000) }}
                    </v-col>
                    <v-col
                            xs="12"
                            md="6"
                            class="text-center"
                    >
                        Address : <br/> P-{{ fetchCurrentSubnetValidatingStatus().address }}
                    </v-col>
                    <v-col
                            xs="12"
                            md="6"
                            class="text-center"
                    >
                        Stake : <br/> {{ fetchCurrentSubnetValidatingStatus().stakeAmount }} nAVAX
                    </v-col>
                </v-row>
            </v-col>
            <v-col v-else>
                Please log in .
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Account} from "@/store/modules/account.store";
    import {
        ExportAvaPChain,
        ExportAvaXChain,
        ImportAvaPChain,
        PAddressExport,
        PAddressImport, PChainAccount,
        User, Validator,
        XAddressExport,
        XAddressImport
    } from "@/types";
    import DoughnutChart from "@/components/DoughnutChart.vue";
    import {Subnets} from "@/store/modules/subnets.store";

    export default Vue.extend({
        components: {DoughnutChart},
        props: ['id'],
        data() {
            return {
                password: "",
                toPStepper: 1,
                toXStepper: 1,
                selectedSubnet: "11111111111111111111111111111111LpoYY",
                loggedIn: false,
                exportPassword: "",
                snackbarXChainPrivateKey: false,
                snackbarPChainPrivateKey: false,
                xAddressPKey: "",
                pAddressPKey: "",
                xAddressPKeyImport: "",
                xAddressIndex: -1,
                dialog: false,
                pChainToXChainDialog: false,
                pAccountIndex: -1,
                intervalId: {} as NodeJS.Timeout,
                xExportSlider: 0,
                pExportSlider: 0,
                xExportAvaMax: 10000,
                pExportAvaMax: 10000,
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
        computed: {
            checkVuexError() {
                const ctx = Account.context(this.$store);
                if (ctx.state.showError) {
                    setTimeout(() => {
                        ctx.actions.markErrorAsShown()
                    }, 5000)
                }
                return ctx.state.showError
            },
            displayError() {
                const ctx = Account.context(this.$store);
                return ctx.state.error
            },
            subnetIds() {
                const ctx = Account.context(this.$store);
                return ctx.state.subnets.map(subnet => subnet.id);
            }
        },
        methods: {
            closeDialog() {
                this.dialog = false;
                this.pChainToXChainDialog = false;
                this.toPStepper = 1;
                this.toXStepper = 1;
                this.xExportSlider = 0;
                this.pExportSlider = 0;
            },
            async fetchInfo() {
                const subnetCtx = Subnets.context(this.$store);
                await subnetCtx.actions.fetchSubnetCurrentValidators(this.selectedSubnet)
            },
            async login() {
                const accountCtx = Account.context(this.$store)
                const subnetCtx = Subnets.context(this.$store);
                this.loginDialog = false;
                this.loggedIn = true;
                accountCtx.actions.listXAddresses({name: this.id, password: this.password} as User)
                accountCtx.actions.listPAccounts({name: this.id, password: this.password} as User)
                subnetCtx.actions.listSubnets()
            },
            fetchCurrentSubnetValidatingStatus(): Validator | undefined {
                const subnetCtx = Subnets.context(this.$store);
                return subnetCtx.getters.subnetValidatingInfo(this.selectedSubnet)
            },
            isOwnAddress() {
                const subnetCtx = Subnets.context(this.$store);
                const accountCtx = Account.context(this.$store)
                const info: Validator = subnetCtx.getters.subnetValidatingInfo(this.selectedSubnet)
                let ownAddressValidating = false;
                accountCtx.state.pAccounts.forEach((p: PChainAccount) => {
                    if(p.address === info.address){
                        ownAddressValidating = true;
                    }
                })
                return ownAddressValidating;
            },
            signTx(unsignedTx: string, pAccount: string) {
                const accountCtx = Account.context(this.$store)
                const success = accountCtx.actions.signTx({
                    username: this.id,
                    password: this.password,
                    tx: unsignedTx,
                    signer: pAccount
                })
                if (success) {
                    this.toXStepper = 3
                } else {
                    this.toXStepper = 10
                }
            },

            async issueTx() {
                const accountCtx = Account.context(this.$store)
                await accountCtx.actions.issueTx()
                this.toXStepper = 4
            },
            async importAvaFromPChain(xAddress: string) {
                const accountCtx = Account.context(this.$store)
                const success = await accountCtx.actions.importAvaFromPChain({
                    username: this.id,
                    password: this.password,
                    to: xAddress
                })
                if (success) {
                    this.intervalId = setInterval(() => {
                        accountCtx.actions.checkTxStatus({
                            txId: accountCtx.state.txId,
                            timeout: this.intervalId
                        })
                    }, 1000);
                    this.toPStepper = 5
                } else {
                    this.toPStepper = 10
                }
            },
            async logout() {
                const accountCtx = Account.context(this.$store)
                this.loggedIn = false;
                this.password = "";
                accountCtx.mutations.resetState();
            },
            async fetchXChainInfo() {
                const accountCtx = Account.context(this.$store)
                accountCtx.actions.listXAddresses({name: this.id, password: this.password} as User)
                accountCtx.actions.listPAccounts({name: this.id, password: this.password} as User)
            },
            async createAddress() {
                const accountCtx = Account.context(this.$store)
                await accountCtx.actions.createXAddresse({name: this.id, password: this.password} as User);
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
            async exportAvaToPChain(to: string) {
                const accountCtx = Account.context(this.$store)
                const success = await accountCtx.actions.exportAvaToPChain({
                    username: this.id,
                    password: this.password,
                    amount: this.xExportSlider,
                    to
                } as ExportAvaPChain)

                if (success) {
                    this.intervalId = setInterval(() => {
                        accountCtx.actions.checkTxStatus({
                            txId: accountCtx.state.txId,
                            timeout: this.intervalId
                        })
                    }, 1000);
                    this.toPStepper = 2
                } else {
                    this.toPStepper = 10
                }
            },
            async importAvaFromXChain(to: string, nonce: number) {
                nonce++
                console.log(nonce);
                const accountCtx = Account.context(this.$store)
                const success = await accountCtx.actions.importAvaFromXChain({
                    username: this.id,
                    password: this.password,
                    nonce: nonce,
                    to
                } as ImportAvaPChain)

                if (success) {
                    this.toPStepper = 4
                } else {
                    this.toPStepper = 10
                }
            },
            async exportAvaToXChain(to: string, nonce: number) {
                nonce++
                console.log(nonce);
                const accountCtx = Account.context(this.$store)
                const success = await accountCtx.actions.exportAvaToXChain({
                    amount: this.pExportSlider,
                    nonce: nonce,
                    to
                } as ExportAvaXChain)

                if (success) {
                    this.toXStepper = 2
                } else {
                    this.toXStepper = 10
                }
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
                this.snackbarXChainPrivateKey = true;
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
