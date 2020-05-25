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
                    <v-card-title class="headline mb-1">
                        Node ID
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        {{ this.$store.state.Admin.nodeId }}
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col
                    cols="6"
                    md="3"
            >
                <v-card
                        class="pa-2"
                        v-model="this.$store.state.Health.healthy"
                        :class="this.$store.state.Health.healthy ? 'node-status-green-background' : 'node-status-red-background'"
                        outlined
                        tile
                >
                    <v-card-title class="headline mb-1">
                        Node status
                    </v-card-title>
                </v-card>

            </v-col>
            <v-col
                    cols="6"
                    md="3"
            >
                <v-card
                        class="pa-2"
                        v-model="this.$store.state.XChain.balance.balance"
                        :class="this.$store.state.XChain.balance.balance !== 0 ? 'node-status-green-background' : 'node-status-red-background'"
                        outlined
                        tile
                >
                    <v-card-title class="headline mb-1">
                        <v-tooltip>
                            <template v-slot:activator="{ on }">
                                <div>
                                    Node Bootstrapped
                                    <v-icon v-on="on" class="mr-2">fas fa-question</v-icon>
                                </div>
                            </template>
                            <span>We check the balance of the faucet to see whether the node is bootstrapped or not.
                                <a>https://docs.ava.network/v1.0/en/quickstart/ava-getting-started/</a></span>
                        </v-tooltip>
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>

        <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
        <v-row>
            <v-col
                    v-for="n in 3"
                    :key="n"
                    cols="6"
                    md="4"
            >
                <v-card
                        class="pa-2"
                        outlined
                        tile
                >
                    .col-6 .col-md-4
                </v-card>
            </v-col>
        </v-row>

        <!-- Columns are always 50% wide, on mobile and desktop -->
        <v-row>
            <v-col
                    v-for="n in 2"
                    :key="n"
                    cols="6"
            >
                <v-card
                        class="pa-2"
                        outlined
                        tile
                >
                    .col-6
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {},
        mounted() {
            console.log(this.$store.state.XChain.balance.balance)
            this.$store.dispatch('Admin/fetchNodeId');
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
