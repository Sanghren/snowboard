<template>
    <v-container class="theme--dark lighten-5">
        <!-- Stack the columns on mobile by making one full-width and the other half-width -->
        <v-row>
            <v-col
                    cols="18"
                    md="12"
                    class="text-center"
            >
                <h2>Dashboard</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col
                    cols="4"
                    md="4"
            >
                <v-card
                        class="pa-2"
                        outlined
                        tile
                >
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline">Node ID</v-list-item-title>
                        </v-list-item-content>
                        <v-tooltip>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                            </template>
                            <span>The NodeID is not an address, it's hash of your staking certificate used to identify your node. The NodeID also becomes a validator ID if you add your node to a subnet.</span>
                        </v-tooltip>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-card-text>
                        {{ this.$store.state.Admin.nodeId }}
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col
                    cols="6"
                    md="4"
            >
                <v-card
                        class="pa-2"
                        v-model="this.$store.state.Health.healthy"
                        :class="this.$store.state.Health.healthy ? 'node-status-green-background' : 'node-status-red-background'"
                        outlined
                        tile
                >
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline">Node Status</v-list-item-title>
                        </v-list-item-content>
                        <v-tooltip>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                            </template>
                            <span>Whether your node is marked as 'healthy'</span>
                        </v-tooltip>
                    </v-list-item>
                </v-card>

            </v-col>
            <v-col
                    cols="6"
                    md="4"
            >
                <v-card
                        class="pa-2"
                        v-model="this.$store.state.XChain.balance.balance"
                        :class="this.$store.state.XChain.balance.balance !== 0 ? 'node-status-green-background' : 'node-status-red-background'"
                        outlined
                        tile
                >
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline">Bootstrapped</v-list-item-title>
                        </v-list-item-content>
                        <v-tooltip>
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
        </v-row>

        <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
        <v-row>
            <v-col
                    v-for="(metric, index) in this.$store.state.Metrics.metrics.slice(0,3)"
                    :key="index"
                    cols="6"
                    md="4"
            >
                <v-card
                        class="pa-2"
                        outlined
                        tile
                >
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline">{{ metric.name }}</v-list-item-title>
                        </v-list-item-content>
                        <v-tooltip>
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                            </template>
                            <span>{{ metric.help }}</span>
                        </v-tooltip>
                    </v-list-item>
                    <div>
                        <MetricChart :metric="metric"></MetricChart>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import Vue from 'vue';
    import MetricChart from "@/components/MetricChart.vue";

    export default Vue.extend({
        components: {MetricChart},
        props: {},
        mounted() {
            this.$store.dispatch('Admin/fetchNodeId');
            this.$store.dispatch('Metrics/fetchMetrics');
        },
        methods: {}
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
</style>
