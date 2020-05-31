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
                        <b class="text--primary">{{ $store.state.Dashboard.nodeId }}</b>
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
                        <b class="text--primary">{{this.$store.state.Dashboard.peers.length}}</b>
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
                                v-model="$store.state.Health.healthy"
                                :class="$store.state.Health.healthy ? 'node-status-green-background' : 'node-status-red-background'"
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
                                :loading="$store.state.Dashboard.loading.get('bootstrap')"
                                class="mb-2"
                                height="100%"
                                width="100%"
                                :class="$store.state.Dashboard.bootstrapped ? 'node-status-green-background' : $store.state.Dashboard.loading.get('bootstrap') ? 'node-status-orange-background' : 'node-status-red-background'"
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
                                v-model="$store.getters['Dashboard/validatingStatus']"
                                :class="$store.getters['Dashboard/validatingStatus'] === 1 ? 'node-status-green-background' : $store.getters['Dashboard/validatingStatus'] === 2 ? 'node-status-red-background' : 'node-status-orange-background'"
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
            <template v-if="!$store.state.Metrics.loading.get('metrics')">
                <v-col
                        v-for="(metric, index) in metricToDisplay"
                        :key="index"
                        cols="6"
                        md="4"
                >
                    <MetricChart :metric="metric"></MetricChart>
                </v-col>
            </template>
            <!-- ToDo Not optimal            -->
            <template v-if="$store.state.Metrics.loading.get('metrics')">
                <v-col
                        v-for="(metric, index) in [1,2,3]"
                        :key="index"
                        cols="6"
                        md="4"
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
                intervalId: {} as NodeJS.Timeout
            }
        },
        beforeMount() {
            this.$store.dispatch('Dashboard/fetchBootstrapStatus')
        },
        mounted() {
            this.$store.dispatch('Dashboard/fetchNodeId');
            this.$store.dispatch('Dashboard/fetchNetworkId');
            this.$store.dispatch('Dashboard/fetchPeers');
            this.$store.dispatch('Metrics/fetchMetrics');
            this.$store.dispatch('Dashboard/fetchCurrentValidators');
            this.fetchInterestingMetrics();

            const intervalId = setInterval(() => {
                this.$store.dispatch('Dashboard/fetchBootstrapStatus', intervalId)
            }, 120000);
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
