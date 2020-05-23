<script>
    import { Bar } from 'vue-chartjs'
    export default {
        extends: Bar,
        name: "HistogramChart",
        props: ['chartdata', 'options'],
        mounted () {
            this.renderChart(this.chartdata, this.options)
        }
    }
</script>

<style scoped>

</style>