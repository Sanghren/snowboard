<template>
    <v-container class="theme--dark lighten-5">
        <template v-for="(chunk, rowIndex) in productChunks">
            <v-row :key="rowIndex" dense>
                <v-col
                        v-for="(metric, index) in chunk"
                        :key="index"
                        cols="3">
                    <MetricChart :metric="metric"></MetricChart>
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>

<script lang="ts">
    import {Vue} from 'vue-property-decorator';
    import MetricChart from "@/components/MetricChart.vue";
    import _ from 'lodash'

    export default Vue.extend({
        components: {MetricChart},
        props: ['msg', 'metrics'],
        computed: {
            productChunks() {
                return _.chunk(Object.values(this.$store.state.Metrics.metrics), 4);
            }
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
