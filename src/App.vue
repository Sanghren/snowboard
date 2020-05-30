<template>
    <v-app>
        <v-app-bar
                app
                dark
        >
            <v-spacer></v-spacer>
            <div>
                <router-link to="/node-metrics" class="white--text">Metrics</router-link>
<!--                <v-divider-->
<!--                        class="mx-4"-->
<!--                        vertical-->
<!--                ></v-divider>-->
<!--                <router-link to="/users" class="white&#45;&#45;text">Users</router-link>-->
                <v-divider
                        class="mx-4"
                        vertical
                ></v-divider>
                <router-link to="/p-chain" class="white--text">Chains</router-link>
                <v-divider
                        class="mx-4"
                        vertical
                ></v-divider>
                <router-link to="/" class="white--text">Dashboard</router-link>
                <v-divider
                        class="mx-4"
                        vertical
                ></v-divider>
                <router-link to="/tools" class="white--text">Tools</router-link>
            </div>

            <v-spacer></v-spacer>
            <v-divider
                    class="mx-4"
                    vertical
            ></v-divider>
            <router-link to="/settings" class="white--text">
                    <span class="material-icons">
                        settings
                    </span>
            </router-link>
            <v-btn
                    href="https://github.com/tbrunain/snowboard"
                    target="_blank"
                    text
            >
                <span class="material-icons">
                    code
                </span>
            </v-btn>
        </v-app-bar>

        <v-content>
            <v-alert v-model="this.$store.state.Metrics.nodeDown" type="error" dismissible>Error connecting to your
                node, check the url in settings !
            </v-alert>
            <router-view/>
        </v-content>
    </v-app>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        name: 'App',

        components: {},
        data() {
            return {
                metrics: null,
                nodeDown: true,
            }
        },
        methods: {
            updateSettings(e: Event) {
                this.$store.dispatch('Metrics/updateSettings')
            },
            isNodeUp() {
                //ToDo Need to rethink this, becoming messy
                this.$store.dispatch('Health/fetchLiveness')
                this.$store.dispatch('Metrics/isNodeUp')
            },
            isBootstrapped() {
                //ToDo Need to rethink this, becoming messy
                this.$store.dispatch('XChain/fetchBalance')
            }
        },
        beforeMount() {
            this.isNodeUp();
            this.isBootstrapped();
        },
        mounted() {
            setInterval(() => {
                this.isNodeUp();
            }, 10000);
            setInterval(() => {
                this.isBootstrapped();
            }, 60000);
        }
    });
</script>

<style>
    a { text-decoration: none; }
</style>
