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
            <Dashboard msg="Welcome to " :metrics="this.metrics"/>
        </v-content>
    </v-app>
</template>

<script lang="ts">
    import Vue from 'vue';
    import axios from "axios";
    import parsePrometheusTextFormat from "parse-prometheus-text-format";
    import Dashboard from './components/Dashboard.vue';

    export default Vue.extend({
        name: 'App',

        components: {
            Dashboard,
        },
        data() {
            return {
                metrics: null
            }
        },
        methods: {
            loadData: function () {
                axios
                    .get('http://www.mocky.io/v2/5ec8e9082f0000354adb70ca')
                    .then((response) => this.metrics = parsePrometheusTextFormat(response.data));
            }
        },
        mounted: function () {
            this.loadData();

            setInterval(() => {
                //ts-ignore
                this.loadData();
            }, 10000);
        }
    });
</script>
