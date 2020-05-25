<template>
    <div>
        <div v-if="metric.type === 'HISTOGRAM'">
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
            <p>Name : {{ metric.name }}</p>
            <p>Value : {{ Object.values(metric.metrics[0])[0] }}</p>
        </div>
        <div v-else>
        </div>
    </div>
</template>

<script>
    import HistogramChart from "@/components/HistogramChart.vue";
    import DoughnutChart from "@/components/DoughnutChart.vue";

    export default {
        name: "MetricChart",
        components: {DoughnutChart, HistogramChart},
        props: ["metric"],
        methods: {}
    };
</script>

<style scoped>
</style>