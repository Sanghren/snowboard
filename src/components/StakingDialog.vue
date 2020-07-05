<template>
    <v-dialog
            v-model="showStakingDialog"
            hide-overlay
            width="100%"
            transition="dialog-bottom-transition"
            scrollable
    >
        <v-stepper
                v-model="stakingStepper"
        >
            <v-stepper-header>
                <v-stepper-step step="1">Start staking AVA on {{ subnetId }}</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2">Sign Tx</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3">Issue Tx</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="4">End</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-container v-if="subnetId === '11111111111111111111111111111111LpoYY'">
                        <v-row>
                            <v-col>
                                <v-row>
                                    <v-col>
                                        <v-row>
                                            <v-col>
                                                NodeId : {{ $store.state.Dashboard.nodeId }}
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                Start time :
                                                <v-datetime-picker label="Select Datetime" v-model="startTime"> </v-datetime-picker>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                End time :
                                                <v-datetime-picker label="Select Datetime" v-model="endTime"> </v-datetime-picker>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        Stake Amount :
                                        <v-slider
                                                v-model="stakeAmount"
                                                class="align-center"
                                                :max="maxStakeAmount"
                                                :min="0"
                                                hide-details
                                        >
                                            <template v-slot:append>
                                                <v-text-field
                                                        v-model="stakeAmount"
                                                        class="mt-0 pt-0"
                                                        hide-details
                                                        single-line
                                                        type="number"
                                                        style="width: 60px"
                                                ></v-text-field>
                                            </template>
                                        </v-slider>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        Delegation Fee Rate :
                                        <v-slider
                                                v-model="delegationFeeRate"
                                                class="align-center"
                                                :max="1000000"
                                                :min="0"
                                                hide-details
                                        >
                                            <template v-slot:append>
                                                <v-text-field
                                                        v-model="delegationFeeRate"
                                                        class="mt-0 pt-0"
                                                        hide-details
                                                        single-line
                                                        type="number"
                                                        style="width: 60px"
                                                ></v-text-field>
                                            </template>
                                        </v-slider>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        Payer nonce : {{ payerNonce }}
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        Destination : {{ destination }}
                                        <div v-html="jdenticon"/>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-btn @click="addDefaultSubnetValidator()">Create Tx</v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-container v-else>
                        <v-row>
                            <v-col>
                                <v-row>
                                    <v-col>
                                        <v-row>
                                            <v-col>
                                                NodeId : {{ $store.state.Dashboard.nodeId }}
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                Start time :
                                                <v-datetime-picker label="Select Datetime" v-model="startTime"> </v-datetime-picker>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                End time :
                                                <v-datetime-picker label="Select Datetime" v-model="endTime"> </v-datetime-picker>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        Stake Amount :
                                        <v-slider
                                                v-model="stakeAmount"
                                                class="align-center"
                                                :max="maxStakeAmount"
                                                :min="0"
                                                hide-details
                                        >
                                            <template v-slot:append>
                                                <v-text-field
                                                        v-model="stakeAmount"
                                                        class="mt-0 pt-0"
                                                        single-line
                                                        type="number"
                                                        style="width: 60px"
                                                ></v-text-field>
                                            </template>
                                        </v-slider>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        Weight
                                        <v-slider
                                                v-model="weight"
                                                class="align-center"
                                                :max="100"
                                                :min="0"
                                                hide-details
                                        >
                                            <template v-slot:append>
                                                <v-text-field
                                                        v-model="weight"
                                                        class="mt-0 pt-0"
                                                        single-line
                                                        type="number"
                                                        style="width: 60px"
                                                ></v-text-field>
                                            </template>
                                        </v-slider>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        Payer nonce : {{ payerNonce }}
                                    </v-col>
                                </v-row>
                                <v-row align="center">
                                    <v-col>
                                        <span v-html="jdenticon"/>Destination : {{ destination }}
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-btn @click="addNonDefaultSubnetValidator()">Create Tx</v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-stepper-content>
                <v-stepper-content step="2">
                    <v-row>
                        <v-col>
                            Unsigned Tx : {{ unsignedTx }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-row>
                            <v-col>
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
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-btn @click="signTx()">Sign Tx</v-btn>
                            </v-col>
                        </v-row>
                    </v-row>
                </v-stepper-content>
                <v-stepper-content step="3">
                    <v-row>
                        <v-col>
                            <span class="text-center">{{ $store.state.Account.txId }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-btn
                                color="primary"
                                @click="issueTx()"
                        >
                            Issue Tx
                        </v-btn>
                    </v-row>
                </v-stepper-content>
                <v-stepper-content step="4">
                    <v-row>
                        <v-col>
                            Success ! (Normally go check ! :p)
                        </v-col>
                    </v-row>
                </v-stepper-content>
            </v-stepper-items>
            <v-btn @click="onClose()">Close</v-btn>
        </v-stepper>
    </v-dialog>
</template>

<script>
    import {Account} from "@/store/modules/account.store";
    import BN from 'bn.js';

    export default {
        name: "StakingDialog",
        props: ["subnetId", "showStakingDialog", "maxStakeAmount", "payerNonce", "destination", "jdenticon", "username"],
        data() {
            return {
                stakingStepper: 1,
                startTime: "",
                endTime: "",
                stakeAmount: 0,
                delegationFeeRate: 0,
                unsignedTx: "",
                password: "",
                show1: false,
                weight: 0
            }
        },
        methods: {
            async addDefaultSubnetValidator() {
                const accountCtx = Account.context(this.$store)
                this.unsignedTx = await accountCtx.actions.addDefaultSubnetValidator({
                    nodeId: this.$store.state.Dashboard.nodeId,
                    startTime: new Date(this.startTime),
                    endTime: new Date(this.endTime),
                    stakeAmount: new BN(this.stakeAmount),
                    payerNonce: this.payerNonce,
                    destination: this.destination,
                    delegationFeeRate: new BN(this.delegationFeeRate)
                })
                if (this.unsignedTx) {
                    this.stakingStepper = 2;
                }
            },
            onClose() {
                this.stakingStepper = 1;
                this.weight = 0;
                this.stakeAmount = 0;
                this.startTime = 0;
                this.endTime = 0;
                this.$emit('stakingClose')
            },
            async addNonDefaultSubnetValidator() {
                const accountCtx = Account.context(this.$store)
                this.unsignedTx = await accountCtx.actions.addNonDefaultSubnetValidator({
                    nodeId: this.$store.state.Dashboard.nodeId,
                    subnetId: this.subnetId,
                    startTime: new Date(this.startTime),
                    endTime: new Date(this.endTime),
                    stakeAmount: new BN(this.stakeAmount),
                    payerNonce: this.payerNonce,
                    weight: this.weight
                })
                if (this.unsignedTx) {
                    this.stakingStepper = 2;
                }
            },
            async issueTx() {
                const accountCtx = Account.context(this.$store)
                const success = await accountCtx.actions.issueTx()
                if (success) {
                    this.intervalId = setInterval(() => {
                        accountCtx.actions.checkTxStatus({
                            txId: accountCtx.state.txId,
                            timeout: this.intervalId
                        })
                    }, 1000);
                    this.stakingStepper = 4
                } else {
                    this.stakingStepper = 10
                }
            },
            signTx() {
                const accountCtx = Account.context(this.$store)
                const success = accountCtx.actions.signTx({
                    username: this.username,
                    password: this.password,
                    tx: this.unsignedTx,
                    signer: this.destination
                })
                if (success) {
                    this.stakingStepper = 3
                }
            },
        }
    };
</script>

<style scoped>
    button {
        background: lightsteelblue;
    }
</style>