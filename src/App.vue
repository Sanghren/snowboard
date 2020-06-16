<template>
    <v-app>
        <v-app-bar
                app
        >
            <v-spacer></v-spacer>
            <div>
                <router-link to="/node-metrics" class="white--text">Metrics</router-link>
                <v-divider
                        class="mx-4"
                        vertical
                ></v-divider>
                <router-link to="/users" class="white--text">Users</router-link>
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
            <v-alert type="info" :value="infoMessage" dismissible>
                <v-progress-circular
                        :rotate="-90"
                        :size="15"
                        :width="5"
                        :value="value"
                        color="primary"
                >
                    {{ value }}
                </v-progress-circular>
                Snowboard is now available as a docker container ! Go check the github repo : )
                I would love to have some feedback, don't hesitate to open an issue in github or to contact me on
                Discord ! (Sanghren#7243)
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
        data() {
            return {
                interval: {},
                infoMessage: true,
                value: 0,
            }
        },
        components: {},
        beforeMount() {
            this.$store.dispatch('Health/fetchLiveness')
            this.$store.dispatch('Metrics/fetchMetrics')
        },
        created() {
            setTimeout(() => {this.infoMessage = false},10000)
        },
        mounted() {
            setInterval(() => {
                this.$store.dispatch('Health/fetchLiveness')
            }, 10000);
            setInterval(() => {
                this.$store.dispatch('Metrics/fetchMetrics')
            }, 60000);
            this.interval = setInterval(() => {
                if (this.value === 100) {
                    return (this.value = 0)
                }
                this.value += 10
            }, 1000)
        }
    });
</script>

<style>
    a {
        text-decoration: none;
    }

    .v-progress-circular {
        margin: 1rem;
    }

</style>
