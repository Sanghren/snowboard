<template>
    <div>
        <v-card v-if="loading"
                class="pa-2"
                outlined
                height="300"
                tile
        >
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="headline">{{ metric.name }}</v-list-item-title>
                </v-list-item-content>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                    </template>
                    <span>We will display here some metrics coming from your node .</span>
                </v-tooltip>
            </v-list-item>
            <div class="text-center">
                <v-progress-circular indeterminate color="red"/>
                <br/>
                <span>Loading data</span>
            </div>
        </v-card>
        <v-card v-if="!loading"
                class="pa-2"
                outlined
                height="100%"
                tile
        >
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="headline">{{ metric.name }}</v-list-item-title>
                </v-list-item-content>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                    </template>
                    <span>{{ metric.help }}</span>
                </v-tooltip>
            </v-list-item>
            <div v-if="metric.type === 'HISTOGRAM'">
                <histogram-chart :chartdata="{labels: Object.keys(metric.metrics[0].buckets),
                datasets: [
      {
        label: metric.name,
        backgroundColor: this.backgroundColors(Object.values(metric.metrics[0].buckets).length),
        data: Object.values(metric.metrics[0].buckets)
      }
    ]}">
                </histogram-chart>
            </div>
            <div v-if="metric.type === 'GAUGE'">
                <doughnut-chart :chartdata="{
                labels: [ metric.name, 'unused'],
                datasets: [
      {
        label: ['value', 'unused'],
        backgroundColor: ['#008000', '#ff0000'],
        data: [metric.metrics[0].value, 100 - metric.metrics[0].value]
      }
    ]}"></doughnut-chart>
            </div>
            <div v-if="metric.type === 'COUNTER'">
                <v-card-text>
                    <p class="display-1 text--primary text-center">
                        {{ Object.values(metric.metrics[0])[0] }}
                    </p>
                </v-card-text>
            </div>
            <div v-else>
            </div>
        </v-card>
    </div>
</template>

<script>
    import HistogramChart from "@/components/HistogramChart.vue";
    import DoughnutChart from "@/components/DoughnutChart.vue";

    export default {
        name: "MetricChart",
        components: {DoughnutChart, HistogramChart},
        props: ["metric", "loading"],
        methods: {
            backgroundColors(size) {
                const pool = [];
                for (let i = 0; i < size; i++) {
                    pool.push('#008000');
                }
                return pool;
            }
        }
    };
</script>

<style scoped>
</style>