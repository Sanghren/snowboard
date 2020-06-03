// State object
import axios from "axios";
import parsePrometheusTextFormat from "parse-prometheus-text-format";
import {ErrorContext} from "@/types";
import {Actions, Context, Getters, Module, Mutations} from "vuex-smart-module";
import {Api, ApiState} from "@/store/modules/api.store";
import {Store} from "vuex";

class MetricsState {
    metrics: [] = [];
    loading = new Map();
    error = new Map();
}


// Getter functions
class MetricsGetters extends Getters<MetricsState> {
    metrics() {
        return this.state.metrics;
    }
}

class MetricsMutations extends Mutations<MetricsState> {
    setMetrics(data: []) {
        this.state.metrics = data
    }

    setLoading(key: string) {
        this.state.loading.set(key, true)
    }

    setLoaded(key: string) {
        this.state.loading.set(key, false);
    }

    setError(errorContext: ErrorContext) {
        this.state.metrics = [];
        this.state.error.set(errorContext.key, errorContext.error)
    }
}

class MetricsActions extends Actions<MetricsState,
    MetricsGetters,
    MetricsMutations,
    MetricsActions> {
    // ToDo Figure this one out
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api: Context<typeof Api>;

    $init(store: Store<ApiState>): void {
        // Create and retain foo module context
        this.api = Api.context(store)
    }

    fetchMetrics() {
        this.commit('setLoading', 'metrics')
        axios
            .get(this.api.getters.nodeUrl + '/ext/metrics')
            .then((response) => {
                this.commit('setMetrics', parsePrometheusTextFormat(response.data))
                this.commit('setLoaded', 'metrics')
            })
            .catch((e: Error) => {
                this.commit('setError', {key: 'metrics', error: e})
                this.commit('setLoaded', 'metrics')
            });
    }
}

export const Metrics = new Module({
    state: MetricsState,
    getters: MetricsGetters,
    mutations: MetricsMutations,
    actions: MetricsActions
})
