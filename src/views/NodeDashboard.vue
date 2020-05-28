<template>
    <v-container class="theme--dark lighten-5">
        <v-row>
            <v-col
                    cols="4"
                    md="3"
            >
                <v-card
                        class="mx-auto"
                        height="100%"
                        outlined
                        tile
                >
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline text--secondary">Node ID</v-list-item-title>
                        </v-list-item-content>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                            </template>
                            <span>The NodeID is not an address, it's hash of your staking certificate used to identify your node. The NodeID also becomes a validator ID if you add your node to a subnet.</span>
                        </v-tooltip>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-card-text class="headline">
                        <b class="text--primary">{{ this.$store.state.Admin.nodeId }}</b>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col
                    cols="1"
                    md="2"
            >
                <v-card
                        class="mx-auto"
                        height="100%"
                        outlined
                        tile
                >
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline text--secondary">Network ID</v-list-item-title>
                        </v-list-item-content>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                            </template>
                            <span>The NodeID is not an address, it's hash of your staking certificate used to identify your node. The NodeID also becomes a validator ID if you add your node to a subnet.</span>
                        </v-tooltip>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-card-text height="100%" class="text-center display-3" justify="center">
                        <b class="text--primary">{{ this.$store.state.Admin.networkId }}</b>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col
                    cols="4"
                    md="2"
            >
                <v-card
                        class="mx-auto b"
                        height="100%"
                        outlined
                        tile
                >
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline text--secondary">Peers</v-list-item-title>
                        </v-list-item-content>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                            </template>
                            <span>The number of peers to which this node is talking tp.</span>
                        </v-tooltip>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-card-text class="text-center display-3" justify="center">
                        <b class="text--primary">{{this.$store.state.Admin.peers.length}}</b>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col
                    cols="4"
                    md="2"
            >
                <v-container>
                    <v-row>
                        <v-card
                                class="mb-2"
                                height="100%"
                                width="100%"
                                v-model="this.$store.state.Health.healthy"
                                :class="this.$store.state.Health.healthy ? 'node-status-green-background' : 'node-status-red-background'"
                                outlined
                                tile
                        >
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title class="headline">Status</v-list-item-title>
                                </v-list-item-content>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                                    </template>
                                    <span>Whether your node is marked as 'healthy'</span>
                                </v-tooltip>
                            </v-list-item>
                        </v-card>
                    </v-row>
                    <v-row>
                        <v-card
                                class="mb-2"
                                height="100%"
                                width="100%"
                                v-model="this.$store.state.XChain.balance.balance"
                                :class="this.$store.state.XChain.balance.balance !== 0 ? 'node-status-green-background' : 'node-status-red-background'"
                                outlined
                                tile
                        >
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title class="headline">Bootstrapped</v-list-item-title>
                                </v-list-item-content>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                                    </template>
                                    <span>We check the balance of the faucet to see whether the node is bootstrapped or not.
                                <a>https://docs.ava.network/v1.0/en/quickstart/ava-getting-started/</a></span>
                                </v-tooltip>
                            </v-list-item>
                        </v-card>
                    </v-row>
                </v-container>
            </v-col>
            <v-col
                    cols="4"
                    md="2"
            >
                <v-container>
                    <v-row>
                        <v-card
                                class="mb-2"
                                height="100%"
                                width="100%"
                                v-model="this.$store.state.Admin.validator"
                                :class="this.$store.state.Admin.validator === 1 ? 'node-status-green-background' : this.$store.state.Admin.validator === 2 ? 'node-status-red-background' : 'node-status-orange-background'"
                                outlined
                                tile
                        >
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title class="headline">Validating</v-list-item-title>
                                </v-list-item-content>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                                    </template>
                                    <span>Whether your node is present in the "current validator" list or in the "pending" list .'</span>
                                </v-tooltip>
                            </v-list-item>
                        </v-card>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
        <v-row>
            <v-col
                    v-for="(metric, index) in metricToDisplay"
                    :key="index"
                    cols="6"
                    md="4"
            >
                <MetricChart :metric="metric"></MetricChart>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import Vue from 'vue';
    import MetricChart from "@/components/MetricChart.vue";
    import {Metric} from "@/types";

    export default Vue.extend({
        components: {MetricChart},
        props: {},
        data() {
            return {
                metricToDisplay: [] as Metric[]
            }
        },
        mounted() {
            this.$store.dispatch('Admin/fetchNodeId');
            this.$store.dispatch('Admin/fetchNetworkIds');
            this.$store.dispatch('Admin/fetchPeers');
            this.$store.dispatch('Metrics/fetchMetrics');
            this.$store.dispatch('PChain/fetchCurrentValidators');
            this.fetchInterestingMetrics();
        },
        methods: {
            async fetchInterestingMetrics() {
                await new Promise(r => setTimeout(r, 2000));
                this.$store.state.Metrics.metrics.filter((m: Metric) => {
                    if (['gecko_P_accepted', 'gecko_P_sm_blk_requests', 'gecko_X_av_blocked_vts'].includes(m.name)) {
                        this.metricToDisplay.push(m);
                    }
                })
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
