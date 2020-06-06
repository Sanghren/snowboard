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
                <!--                <v-divider-->
                <!--                        class="mx-4"-->
                <!--                        vertical-->
                <!--                ></v-divider>-->
                <!--                <router-link to="/p-chain" class="white&#45;&#45;text">Chains</router-link>-->
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
                <v-img src="./assets/GitHub-Mark-32px.png"/>
            </v-btn>
        </v-app-bar>

        <v-content>
            <v-alert type="info" dismissible>
                Snowboard is now available as a docker container ! Go check the github repo : )
                I would love to have some feedback, don't hesitate to open an issue in github or to contact me on Discord ! (Sanghren#7243)
            </v-alert>

            <v-alert :value="!this.$store.state.Health.healthy" type="error" dismissible>Error connecting to your
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
        beforeMount() {
            this.$store.dispatch('Health/fetchLiveness')
            this.$store.dispatch('Metrics/fetchMetrics')
        },
        mounted() {
            setInterval(() => {
                this.$store.dispatch('Health/fetchLiveness')
            }, 10000);
            setInterval(() => {
                this.$store.dispatch('Metrics/fetchMetrics')
            }, 60000);
        }
    });
</script>

<style>
    a {
        text-decoration: none;
    }
</style>
