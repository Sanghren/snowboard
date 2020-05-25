<template>
    <v-container class="theme--dark lighten-5">
        <template v-for="(chunk, rowIndex) in productChunks">
            <v-row :key="rowIndex">
                <v-col
                        v-for="(metric, index) in chunk"
                        :key="index"
                       cols="4"
                       md="4">
                    <v-card
                            class="pa-2"
                            outlined
                            tile
                    >
                        <div v-if="metric.type === 'HISTOGRAM'">
                            <p><b>{{metric.help}}</b></p>
                            <histogram-chart :chartdata="{labels: Object.keys(metric.metrics[0].buckets),
                datasets: [
      {
        label: metric.name,
        data: Object.values(metric.metrics[0].buckets)
      }
    ]}">
                            </histogram-chart>
                        </div>
                        <div v-if="metric.type === 'GAUGE'">
                            <p><b>{{metric.help}}</b></p>
                            <doughnut-chart :chartdata="{
                labels: [ metric.name, 'unused'],
                datasets: [
      {
        label: ['value', 'unused'],
        backgroundColor: ['#c61616', 'rgb(21,248,0)'],
        data: [metric.metrics[0].value, 100 - metric.metrics[0].value]
      }
    ]}"></doughnut-chart>
                        </div>
                        <div v-if="metric.type === 'COUNTER'">
                            <p><b>{{metric.help}}</b></p>
                            <p>Name : {{ metric.name }}</p>
                            <p>Value : {{ Object.values(metric.metrics[0])[0] }}</p>
                        </div>
                        <div v-else>
                        </div>
                    </v-card>
                </v-col>
                <v-responsive
                        v-if="index === 2"
                        :key="`width-${index}`"
                        width="100%"
                ></v-responsive>
            </v-row>
        </template>
    </v-container>
</template>

<script lang="ts">
    import {Vue} from 'vue-property-decorator';
    import HistogramChart from "@/components/HistogramChart.vue";
    import DoughnutChart from "@/components/DoughnutChart.vue";
    import _ from 'lodash'

    export default Vue.extend({
        components: {DoughnutChart, HistogramChart},
        props: ['msg', 'metrics'],
        computed: {
            productChunks(){
                return _.chunk(Object.values(this.$store.state.Metrics.metrics), 3);
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
