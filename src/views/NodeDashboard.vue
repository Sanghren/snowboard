<template>
    <v-container fluid class="theme--dark">
        <v-row dense>
            <v-col
                    cols="1"
                    class="ma-1 pa-0"
                    no-gutters
            >
                <v-layout row wrap align-center>
                    <v-flex
                            :class="`d-flex justify-center align-center mb-6`"
                            >
                        <v-btn
                                class="grid-center"
                                :disabled="refreshDisabled"
                                @click="refresh()"
                        >
                    <span
                            class="material-icons"
                    >
                        refresh
                    </span>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-col>
            <v-col
                    cols="1"
                    class="ma-1 pa-0"
                    no-gutters
            >
                <v-card
                        v-model="$store.state.Health.healthy"
                        :class="$store.state.Health.healthy ? 'node-status-green-background' : 'node-status-red-background'"
                        tile
                >
                    <v-card-title class="justify-center">
                        <v-tooltip top>
                            <template
                                    :class="$store.state.Health.healthy ? 'node-status-green-background' : 'node-status-red-background'"
                                    v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons md14">
                                    favorite_border
                                </span>
                            </template>
                            <span>Whether your node is marked as 'healthy'</span>
                        </v-tooltip>
                    </v-card-title>
                </v-card>
            </v-col>
            <v-col
                    cols="2"
                    class="ma-1 pa-0"
            >
                <v-card
                        :loading="$store.state.Dashboard.loading.get('bootstrap')"
                        :class="$store.state.Dashboard.bootstrapped ? 'node-status-green-background' : $store.state.Dashboard.loading.get('bootstrap') ? 'node-status-orange-background' : 'node-status-red-background'"
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
            </v-col>
            <v-col
                    cols="2"
                    class="ma-1 pa-0"
            >
                <v-card
                        class="mb-2"
                        v-model="$store.getters['Dashboard/validatingStatus']"
                        :class="$store.getters['Dashboard/validatingStatus'] === 1 ? 'node-status-green-background' : $store.getters['Dashboard/validatingStatus'] === 2 ? 'node-status-red-background' : 'node-status-orange-background'"
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
            </v-col>
        </v-row>
        <v-row dense>
            <v-col
                    cols="2"
                    class="ma-1 pa-0"
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
                        <b class="text--primary">{{ $store.state.Dashboard.nodeId }}</b>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col
                    cols="2"
                    class="ma-1 pa-0"
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
                            <span>The network this node is running .</span>
                        </v-tooltip>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-card-text height="100%" class="text-center display-3" justify="center">
                        <b class="text--primary">{{ this.$store.state.Dashboard.networkId }}</b>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col
                    cols="1"
                    class="ma-1 pa-0"
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
                        <b class="text--primary">{{this.$store.state.Dashboard.peers.length}}</b>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col
                    cols="1 "
                    class="ma-1 pa-0"
            >
                <v-card
                        class="mx-auto b"
                        height="100%"
                        outlined
                        tile
                >
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline text--secondary">Users</v-list-item-title>
                        </v-list-item-content>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                            </template>
                            <span>Number of users in the keystore of this node.</span>
                        </v-tooltip>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-card-text class="text-center display-3" justify="center">
                        <b class="text--primary">{{this.$store.state.Dashboard.users.length}}</b>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col
                    cols="2"
                    class="ma-1 pa-0"
            >
                <v-card
                        class="mx-auto b"
                        height="100%"
                        outlined
                        tile
                >
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline text--secondary">Validators</v-list-item-title>
                        </v-list-item-content>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                            </template>
                            <span>Number of validator nodes.</span>
                        </v-tooltip>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-card-text class="text-center display-3" justify="center">
                        <b class="text--primary">{{this.$store.state.Dashboard.validatingNodes.length}}</b>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col
                    cols="2"
                    class="ma-1 pa-0"
            >
                <v-card
                        class="mx-auto b"
                        height="100%"
                        outlined
                        tile>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline text--secondary">Pending</v-list-item-title>
                        </v-list-item-content>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                            </template>
                            <span>Number of pending validator nodes.</span>
                        </v-tooltip>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-card-text class="text-center display-3" justify="center">
                        <b class="text--primary">{{this.$store.state.Dashboard.pendingValidators.length}}</b>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row dense>
            <template v-if="!$store.state.Metrics.loading.get('metrics')">
                <v-col
                        v-for="(metric, index) in metricToDisplay"
                        :key="index"
                        cols="3"
                >
                    <MetricChart :metric="metric"></MetricChart>
                </v-col>
            </template>
            <!-- ToDo Not optimal            -->
            <template v-if="$store.state.Metrics.loading.get('metrics')">
                <v-col
                        v-for="(metric, index) in [1,2,3,4]"
                        :key="index"
                        cols="3"
                >
                    <MetricChart :metric="metric" :loading="$store.state.Metrics.loading.get('metrics')"></MetricChart>
                </v-col>
            </template>
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
                metricToDisplay: [] as Metric[],
                intervalId: {} as NodeJS.Timeout,
                refreshDisabled: false
            }
        },
        beforeMount() {
            this.$store.dispatch('Dashboard/fetchBootstrapStatus')
        },
        mounted() {
            this.$store.dispatch('Dashboard/fetchNodeId');
            this.$store.dispatch('Dashboard/fetchNetworkId');
            this.$store.dispatch('Dashboard/fetchPeers');
            this.$store.dispatch('Dashboard/fetchUsers');
            this.$store.dispatch('Metrics/fetchMetrics');
            this.$store.dispatch('Dashboard/fetchCurrentValidators');
            this.fetchInterestingMetrics();

            this.intervalId = setInterval(() => {
                this.$store.dispatch('Dashboard/fetchBootstrapStatus', this.intervalId)
            }, 120000);
        },
        methods: {
            async fetchInterestingMetrics() {
                this.$store.state.Metrics.metrics.filter((m: Metric) => {
                    if (['gecko_P_accepted', 'gecko_P_sm_blk_requests', 'gecko_X_av_blocked_vts', 'gecko_X_tx_accepted'].includes(m.name)) {
                        this.metricToDisplay.push(m);
                    }
                })
            },
            async refresh() {
                this.refreshDisabled = true;
                this.metricToDisplay = [];
                this.$store.dispatch('Dashboard/fetchNodeId');
                this.$store.dispatch('Health/fetchLiveness')
                this.$store.dispatch('Dashboard/fetchNetworkId');
                this.$store.dispatch('Dashboard/fetchPeers');
                this.$store.dispatch('Dashboard/fetchUsers');
                this.$store.dispatch('Metrics/fetchMetrics');
                this.$store.dispatch('Dashboard/fetchBootstrapStatus', this.intervalId)
                this.$store.dispatch('Dashboard/fetchCurrentValidators');
                this.fetchInterestingMetrics();
                await new Promise(r => setTimeout(() => this.refreshDisabled = false, 10000));

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

    .material-icons.md14 {
        font-size: 24px;
    }
    .material-icons.md14 {
        display: inline-block
    }
</style>
