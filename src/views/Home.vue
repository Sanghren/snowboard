<template>
    <div class="home">
        <img alt="AVA logo" src="../assets/ava-logo.png">
        <Dashboard msg="Welcome to " :metrics="this.metrics"/>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Dashboard from '@/components/Dashboard.vue'
    import axios from "axios";
    import parsePrometheusTextFormat from "parse-prometheus-text-format";

    export default {
        name: 'Home',
        components: {
            Dashboard
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

            setInterval(function () {
                this.loadData();
            }.bind(this), 1000);
        }
    }
</script>
