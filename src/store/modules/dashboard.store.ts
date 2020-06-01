// State object
import {DashboardState, ErrorContext, Validator, ValidatorStatus} from "@/types";
import BN from "bn.js";
import {nodeApi} from "@/AVA";

const state: DashboardState = {
    bootstrapped: false,
    networkId: "",
    nodeId: "",
    peers: [],
    status: "",
    validatingNodes: [],
    pendingValidators: [],
    validating: ValidatorStatus.UNKNOWN,
    users: [],
    loading: new Map(),
    error: new Map()
}

// Getter functions
const getters = {
    isLoading(state: any, key: string) {
        return state.loading.has(key) ? state.loading.get(key) : false;
    },
    validatingStatus(state: any) {
        let item = state.validatingNodes.filter((v: Validator) => v.id === state.nodeId);
        if(item && item.length === 1){
            return ValidatorStatus.VALIDATING;
        }
         item = state.pendingValidators.filter((v: Validator) => v.id === state.nodeId);
        if(item && item.length === 1){
            return ValidatorStatus.PENDING;
        }
        return ValidatorStatus.UNKNOWN;
    }
}

// Actions
const actions = {
    async fetchNodeId(context: any) {
        const nodeId = await nodeApi.Admin().getNodeID();
        context.commit('setNodeId', nodeId);
    },
    async fetchNetworkId(context: any) {
        const networkId = await nodeApi.Admin().getNetworkID();
        context.commit('setNetworkId', networkId)
    },
    async fetchPeers(context: any) {
        const peers = await nodeApi.Admin().peers();
        context.commit('setPeers', peers)
    },
    async fetchUsers(context: any) {
        const users = await nodeApi.NodeKeys().listUsers();
        context.commit('setUsers', users)
    },
    async fetchBootstrapStatus(context: any, intervalId: NodeJS.Timeout) {
        context.commit('setLoading', 'bootstrap');
        const api = nodeApi;
        // We fetch the balance of the faucet in order to check the bootstrap status .
        // if it return a balance of '0' or a 404, then we are not yet done with the bootstrap .
        let faucetBalance = new BN(0);
        try {
            faucetBalance = await api.AVM().getBalance("X-6cesTteH62Y5mLoDBUASaBvCXuL2AthL", "AVA");
            context.commit('setBootstrapStatus', faucetBalance.gt(new BN(0)))
            context.commit('setLoaded', 'bootstrap');
            clearInterval(intervalId);
        } catch (e) {
            context.commit('setLoaded', 'bootstrap');
            context.commit('setError', {key: "bootstrap", error: e});
        }
    },
    async fetchCurrentValidators(context: any) {
        const api = nodeApi;
        const promises = [];
        promises.push(api.Platform().getCurrentValidators());
        promises.push(api.Platform().getPendingValidators());

        Promise.all(promises)
            .then((values) => {
                context.commit('setValidators', values[0]);
                context.commit('setPendingValidators', values[1]);
            }).catch((e) => {
            context.commit('setError', {key: "validators", error: e});
        })
    }
}
// Mutations
const mutations = {
    setNodeId(state: DashboardState, nodeId: string) {
        state.nodeId = nodeId;
    },
    setNetworkId(state: DashboardState, networkId: string) {
        state.networkId = networkId;
    },
    setPeers(state: DashboardState, peers: string[]) {
        state.peers = peers;
    },
    setUsers(state: DashboardState, users: []) {
        state.users = users;
    },
    setBootstrapStatus(state: DashboardState, bootstrapped: boolean) {
        state.bootstrapped = bootstrapped;
    },
    setValidators(state: DashboardState, validators: []) {
        state.validatingNodes = validators;
    },
    setPendingValidators(state: DashboardState, pendingValidators: []) {
        state.pendingValidators = pendingValidators;
    },
    setLoading(state: DashboardState, key: string) {
        state.loading.set(key, true)
    },
    setLoaded(state: DashboardState, key: string) {
        state.loading.set(key, false);
    },
    setError(state: DashboardState, errorContext: ErrorContext) {
        state.error.set(errorContext.key, errorContext.error)
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
