// State object
import {ErrorContext, Validator, ValidatorStatus} from "@/types";
import BN from "bn.js";
import {nodeApi} from "@/AVA";
import {Actions, Getters, Module, Mutations, createMapper} from "vuex-smart-module";

class DashboardState {
    bootstrapped = false;
    networkId = -1;
    nodeId = "";
    peers: string[] = [];
    status = "";
    validatingNodes: Validator[] = [];
    pendingValidators: Validator[] = [];
    validating = ValidatorStatus.UNKNOWN;
    users: string[] = [];
    loading = new Map();
    error = new Map()
}

class DashboardGetters extends Getters<DashboardState> {
    isLoading(key: string) {
        return this.state.loading.has(key) ? this.state.loading.get(key) : false;
    }

    get validatingStatus() {
        let item = this.state.validatingNodes.filter((v: Validator) => v.id === this.state.nodeId);
        if (item && item.length === 1) {
            return ValidatorStatus.VALIDATING;
        }
        item = this.state.pendingValidators.filter((v: Validator) => v.id === this.state.nodeId);
        if (item && item.length === 1) {
            return ValidatorStatus.PENDING;
        }
        return ValidatorStatus.UNKNOWN;
    }
}

class DashboardMutations extends Mutations<DashboardState> {
    setNodeId(nodeId: string) {
        this.state.nodeId = nodeId;
    }

    setNetworkId(networkId: number) {
        this.state.networkId = networkId;
    }

    setPeers(peers: string[]) {
        this.state.peers = peers;
    }

    setUsers(users: string[]) {
        this.state.users = users;
    }

    setBootstrapStatus(bootstrapped: boolean) {
        this.state.bootstrapped = bootstrapped;
    }

    setValidators(validators: Validator[]) {
        this.state.validatingNodes = validators;
    }

    setPendingValidators(pendingValidators: Validator[]) {
        this.state.pendingValidators = pendingValidators;
    }

    setLoading(key: string) {
        this.state.loading.set(key, true)
    }

    setLoaded(key: string) {
        this.state.loading.set(key, false);
    }

    setError(errorContext: ErrorContext) {
        this.state.error.set(errorContext.key, errorContext.error)
    }
}

class DashboardActions extends Actions<DashboardState,
    DashboardGetters,
    DashboardMutations,
    DashboardActions> {
    async fetchNodeId() {
        const nodeId = await nodeApi.Admin().getNodeID();
        this.mutations.setNodeId(nodeId);
    }

    async fetchNetworkId() {
        const networkId = await nodeApi.Admin().getNetworkID();
        this.mutations.setNetworkId(networkId)
    }

    async fetchPeers() {
        const peers = await nodeApi.Admin().peers();
        this.mutations.setPeers(peers)
    }

    async fetchUsers() {
        const users = await nodeApi.NodeKeys().listUsers();
        this.mutations.setUsers(users)
    }

    async fetchBootstrapStatus(intervalId: NodeJS.Timeout) {
        this.mutations.setLoading('bootstrap');
        const api = nodeApi;
        // We fetch the balance of the faucet in order to check the bootstrap status .
        // if it return a balance of '0' or a 404, then we are not yet done with the bootstrap .
        let faucetBalance = new BN(0);
        try {
            faucetBalance = await api.AVM().getBalance("X-6cesTteH62Y5mLoDBUASaBvCXuL2AthL", "AVA");
            this.mutations.setBootstrapStatus(faucetBalance.gt(new BN(0)))
            this.mutations.setLoaded('bootstrap');
            clearInterval(intervalId);
        } catch (e) {
            this.mutations.setLoaded('bootstrap');
            this.mutations.setError({key: "bootstrap", error: e});
        }
    }

    async fetchCurrentValidators() {
        const api = nodeApi;
        const promises = [];
        promises.push(api.Platform().getCurrentValidators() as Promise<Validator[]>);
        promises.push(api.Platform().getPendingValidators() as Promise<Validator[]>);

        Promise.all(promises)
            .then((values: Validator[][] ) => {
                this.mutations.setValidators(values[0]);
                this.mutations.setPendingValidators(values[1]);
            }).catch((e) => {
            this.mutations.setError({key: "validators", error: e});
        })
    }
}

export const Dashboard = new Module({
    state: DashboardState,
    getters: DashboardGetters,
    mutations: DashboardMutations,
    actions: DashboardActions
})

export const DashboardMapper = createMapper(Dashboard)
