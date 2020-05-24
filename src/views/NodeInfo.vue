<template>
    <v-container class="#121212 lighten-2">
        <v-row
                class="mb-3"
                justify="left"
        >
            <v-col lg="2">
                <v-card
                        class="mx-auto"
                        max-width="344"
                >
                    <v-card-text>
                        <div>Node Id</div>
                        <p class="display-1 text--primary">
                            {{this.$store.state.Admin.nodeId}}
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col md="auto">
                <v-card
                        class="mx-auto"
                        max-width="344"
                >
                    <v-card-text>
                        <div>Peers Id</div>
                        <p class="display-1 text--primary">
                            {{this.$store.state.Admin.peers}}
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col lg="2">
                <v-card
                        class="mx-auto"
                        max-width="344"
                >
                    <v-card-text>
                        <div>Network Id</div>
                        <p class="display-1 text--primary">
                            {{this.$store.state.Admin.networkId}}
                        </p>
                    </v-card-text>
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
            this.$store.dispatch('Admin/fetchNodeId');
            this.$store.dispatch('Admin/fetchNetworkIds');
            this.$store.dispatch('Admin/fetchPeers');
        },
        methods: {}
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
