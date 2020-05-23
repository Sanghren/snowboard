<template>
    <v-app>
        <v-app-bar
                app
                color="primary"
                dark
        >
            <div class="d-flex align-center">
                <v-img
                        alt="AVA Logo"
                        class="shrink mr-2"
                        contain
                        src="./assets/ava-logo.png"
                        transition="scale-transition"
                        width="40"
                />
            </div>

            <v-spacer></v-spacer>
            <div>
                <router-link to="/dashboard" class="white--text">Dashboard</router-link>
                <v-divider
                        class="mx-4"
                        vertical
                ></v-divider>
                <router-link to="/settings" class="white--text">Settings</router-link>
            </div>
            <v-spacer></v-spacer>

            <v-btn
                    href="https://github.com/tbrunain/ava-dashboard"
                    target="_blank"
                    text
            >
                <span class="mr-2">Github</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
        </v-app-bar>

        <v-content>
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
                metrics: null
            }
        },
        methods: {
            loadMetrics() {
                this.$store.commit('loadMetrics')
            },
            updateSettings(e: Event) {
                this.$store.commit('updateSettings')
            }
        },
        mounted: function () {
            this.loadMetrics();
            setInterval(() => {
                this.loadMetrics();
            }, 10000);
        }
    });
</script>
