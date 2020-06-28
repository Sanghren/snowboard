<template>
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
            </v-stepper-items>
            <v-btn @click="closeDialog()">Close</v-btn>
        </v-stepper>
    </v-dialog>
</template>

<script>
    import {BlockchainStatus} from "../types";

    export default {
        name: "StakingDialog",
        props: ["subnetId"],
        methods: {}
    };
</script>

<style scoped>
    button {
        background: lightsteelblue;
    }
</style>