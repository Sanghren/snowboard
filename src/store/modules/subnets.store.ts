// State object
import {Actions, Context, createMapper, Getters, Module, Mutations} from "vuex-smart-module";
import {ErrorContext, Subnet, Validator} from "@/types";
import {nodeApi} from "@/AVA";
import {Store} from "vuex";
import {Api, ApiState} from "@/store/modules/api.store";
import {Dashboard, DashboardState} from "@/store/modules/dashboard.store";

class SubnetsState {
    subnets: Subnet[] = [];
    subnetValidators: Validator[] = [];
    loading = new Map();
    error: string[] = [];
    showError = false;
}

const dashboard = new Module({
    state: DashboardState
})

class SubnetsGetters extends Getters<SubnetsState> {
    // ToDo Figure this one out
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api: Context<typeof Dashboard>;

    $init(store: Store<DashboardState>): void {
        // Create and retain foo module context
        this.api = Dashboard.context(store);
    }

    get subnetsId() {
        return this.state.subnets.map(subnet => subnet.id);
    }

    get subnetValidators() {
        return this.state.subnetValidators.map(validator => validator.id);
    }

    get isValidator() {
        console.log(`BOUH - ${this.api.state.nodeId}`)
        return this.state.subnetValidators.map(validator => validator.id);
    }
}

class SubnetsMutations extends Mutations<SubnetsState> {
    setSubnets(data: Subnet[]) {
        this.state.subnets = data;
    }

    setSubnetValidators(data: Validator[]) {
        this.state.subnetValidators = data;
    }

    setLoading(key: string) {
        this.state.loading.set(key, true)
    }

    setLoaded(key: string) {
        this.state.loading.set(key, false);
    }

    setError(errorContext: ErrorContext) {
        this.state.error.push(errorContext.error.message)
        this.state.showError = true;
    }

    setShowError() {
        this.state.showError = false;
    }

    resetError() {
        this.state.error = []
    }

    resetState() {
        this.state.subnets = [];
    }
}

class SubnetsActions extends Actions<SubnetsState,
    SubnetsGetters,
    SubnetsMutations,
    Actions> {
    async listSubnets() {
        const api = nodeApi;
        this.mutations.setLoading('listSubnets');
        try {
            const subnets = await api.Platform().getSubnets() as Subnet[];
            this.mutations.setSubnets(subnets)
            this.mutations.setLoaded('listSubnets')
            return true;
        } catch (e) {
            this.mutations.setLoaded('listSubnets');
            this.mutations.setError({key: 'listSubnets', error: e})
            return false;
        }
    }

    async fetchSubnetCurrentValidators(subnetID: string) {
        const api = nodeApi;
        this.mutations.setLoading('fetchSubnetCurrentValidators');
        try {
            const validators = await api.Platform().getCurrentValidators(subnetID) as Validator[];
            this.mutations.setSubnetValidators(validators)
            this.mutations.setLoaded('fetchSubnetCurrentValidators')
            return true;
        } catch (e) {
            this.mutations.setLoaded('fetchSubnetCurrentValidators');
            this.mutations.setError({key: 'fetchSubnetCurrentValidators', error: e})
            return false;
        }
    }
}

export const Subnets = new Module({
    state: SubnetsState,
    getters: SubnetsGetters,
    mutations: SubnetsMutations,
    actions: SubnetsActions

})

export const SubnetsMapper = createMapper(Subnets)
