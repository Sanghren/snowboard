// State object
import {ErrorContext, Subnet, Validator, ValidatorStatus} from "@/types";
import BN from "bn.js";
import {nodeApi} from "@/AVA";
import {Actions, Getters, Module, Mutations, createMapper, Context} from "vuex-smart-module";
import axios from "axios";
import parsePrometheusTextFormat from "parse-prometheus-text-format";
import {Api, ApiState} from "@/store/modules/api.store";
import {Store} from "vuex";

export class DashboardState {
    xBootstrapped = false;
    cBootstrapped = false;
    pBootstrapped = false;
    networkId = -1;
    networkName = "";
    nodeVersion = "";
    nodeId = "";
    subnets: Subnet[] = [];
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

    get nodeId() {
        return this.state.nodeId;
    }
}


class DashboardMutations extends Mutations<DashboardState> {
    setNodeId(nodeId: string) {
        this.state.nodeId = nodeId;
    }

    setNetworkId(networkId: number) {
        this.state.networkId = networkId;
    }

    setNetworkName(networkName: string) {
        this.state.networkName = networkName;
    }

    setNodeVersion(nodeVersion: string) {
        this.state.nodeVersion = nodeVersion;
    }

    setPeers(peers: string[]) {
        this.state.peers = peers;
    }

    setUsers(users: string[]) {
        this.state.users = users;
    }

    setCBootstrapStatus(bootstrapped: boolean) {
        this.state.cBootstrapped = bootstrapped
    }

    setXBootstrapStatus(bootstrapped: boolean) {
        this.state.xBootstrapped = bootstrapped
    }

    setPBootstrapStatus(bootstrapped: boolean) {
        this.state.pBootstrapped = bootstrapped
    }

    setValidators(validators: Validator[]) {
        this.state.validatingNodes = validators;
    }

    setSubnets(data: Subnet[]) {
        this.state.subnets = data;
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

    // ToDo Figure this one out
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api: Context<typeof Api>;

    $init(store: Store<ApiState>): void {
        // Create and retain foo module context
        this.api = Api.context(store)
    }

    async fetchNodeId() {
        const nodeId = await nodeApi.Info().getNodeID();
        this.mutations.setNodeId(nodeId);
    }

    async fetchNetworkId() {
        const networkId = await nodeApi.Info().getNetworkID();
        this.mutations.setNetworkId(networkId)
    }

    async fetchNodeVersion() {
        const nodeVersion = await nodeApi.Info().getNodeVersion();
        this.mutations.setNodeVersion(nodeVersion)
    }

    async fetchNetworkName() {
        const networkName = await nodeApi.Info().getNetworkName();
        this.mutations.setNetworkName(networkName)
    }

    async fetchPeers() {
        const peers = await nodeApi.Info().peers();
        this.mutations.setPeers(peers)
    }

    async fetchUsers() {
        const users = await nodeApi.NodeKeys().listUsers();
        this.mutations.setUsers(users)
    }

    async fetchBootstrapStatusXChain(intervalId: NodeJS.Timeout) {
        this.mutations.setLoading('xBootstrap');
        // We fetch the balance of the faucet in order to check the bootstrap status .
        // if it return a balance of '0' or a 404, then we are not yet done with the bootstrap .
        axios
            .post(
                this.api.getters.nodeUrl + '/ext/info',
                {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "info.isBootstrapped",
                    "params": {
                        "chain": "X"
                    }
                },
                {
                    headers:{
                        'Content-Type': 'application/json'
                    }
                })
            .then((response: any) => {
                this.mutations.setXBootstrapStatus(response.data.result.isBootstrapped)
                this.mutations.setLoaded('xBootstrap');
            })
            .catch((e: Error) => {
                this.mutations.setLoaded('xBootstrap');
                this.mutations.setXBootstrapStatus(false)
                this.mutations.setError({key: "xBootstrap", error: e});
            });
    }

    async fetchBootstrapStatusPChain(intervalId: NodeJS.Timeout) {
        this.mutations.setLoading('pBootstrap');
        // We fetch the balance of the faucet in order to check the bootstrap status .
        // if it return a balance of '0' or a 404, then we are not yet done with the bootstrap .
        axios
            .post(
                this.api.getters.nodeUrl + '/ext/info',
                {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "info.isBootstrapped",
                    "params": {
                        "chain": "P"
                    }
                },
                {
                    headers:{
                        'Content-Type': 'application/json'
                    }
                })
            .then((response: any) => {
                this.mutations.setPBootstrapStatus(response.data.result.isBootstrapped)
                this.mutations.setLoaded('pBootstrap');
            })
            .catch((e: Error) => {
                this.mutations.setLoaded('pBootstrap');
                this.mutations.setPBootstrapStatus(false)
                this.mutations.setError({key: "pBootstrap", error: e});
            });
    }

    async fetchBootstrapStatusCChain(intervalId: NodeJS.Timeout) {
        this.mutations.setLoading('cBootstrap');
        // We fetch the balance of the faucet in order to check the bootstrap status .
        // if it return a balance of '0' or a 404, then we are not yet done with the bootstrap .
        axios
            .post(
                this.api.getters.nodeUrl + '/ext/info',
                {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "info.isBootstrapped",
                    "params": {
                        "chain": "C"
                    }
                },
                {
                    headers:{
                        'Content-Type': 'application/json'
                    }
                })
            .then((response: any) => {
                this.mutations.setCBootstrapStatus(response.data.result.isBootstrapped)
                this.mutations.setLoaded('cBootstrap');
            })
            .catch((e: Error) => {
                this.mutations.setLoaded('cBootstrap');
                this.mutations.setCBootstrapStatus(false)
                this.mutations.setError({key: "cBootstrap", error: e});
            });
    }

    async fetchCurrentValidators() {
        const api = nodeApi;
        const promises = [];
        promises.push(api.Platform().getCurrentValidators() as Promise<Validator[]>);
        promises.push(api.Platform().getPendingValidators() as Promise<Validator[]>);

        Promise.all(promises)
            .then((values: Validator[][]) => {
                this.mutations.setValidators(values[0]);
                this.mutations.setPendingValidators(values[1]);
            }).catch((e) => {
            this.mutations.setError({key: "validators", error: e});
        })
    }

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
}

export const Dashboard = new Module({
    state: DashboardState,
    getters: DashboardGetters,
    mutations: DashboardMutations,
    actions: DashboardActions
})

export const DashboardMapper = createMapper(Dashboard)
