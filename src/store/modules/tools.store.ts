// State object
import {ErrorContext, KeystoreState, MetricsState, ToolsState} from "@/types";
import {bootstrapNodeApi, nodeApi} from "@/AVA";
import Tools from "@/views/Tools.vue";

const state: ToolsState = {
    nodeStatus: "",
    txStatus: "",
    bootstrapTxStatus: "",
    loading: new Map(),
    error: new Map(),
}

// Getter functions
const getters = {
    isTxLoading: (state: ToolsState) => {
        return state.loading.has('bootstrapTxCheck') && state.loading.get('bootstrapTxCheck') || state.loading.has('nodeTxCheck') && state.loading.get('nodeTxCheck')
    },
    isNodeStatusLoading: (state: ToolsState) => {
        return state.loading.has('nodeStatusCheck') && state.loading.get('nodeStatusCheck')
    },
    displayTx: (state: ToolsState) => {
        return state.bootstrapTxStatus.length > 0 && state.txStatus.length > 0;
    },
    displayNodeStatus: (state: ToolsState) => {
        return state.nodeStatus.length > 0;
    },
    hasError: (state: ToolsState) => {
        return (state.error.has('bootstrapTxCheck') && state.error.get('bootstrapTxCheck')) || (state.error.has('nodeTxCheck') && state.error.get('nodeTxCheck'))
    },
}

// Actions
const actions = {
    async checkTxStatus(context: any, txCheck: any) {
        let avmApi;
        const key = txCheck.bootstrapNode ? 'bootstrapTxCheck' : 'nodeTxCheck'
        context.commit('setLoading', key)
        if (txCheck.bootstrap) {
            avmApi = await bootstrapNodeApi.AVM();
        } else {
            avmApi = await nodeApi.AVM();
        }

        try {
            const txStatus = await avmApi.getTxStatus(txCheck.txId);
            context.commit('setTxStatus', {bootstrapNode: txCheck.bootstrapNode, status: txStatus})
            context.commit('setLoaded', key)
        } catch (e) {
            context.commit('setTxStatus', {bootstrapNode: txCheck.bootstrapNode, status: "INVALID"})
            context.commit('setLoaded', key)
            context.commit('setError', {key, error: e})
        }
    },
    async checkBootstrapStatus(context: any, payload: any) {
        const pendingValidators = await nodeApi.Platform().getPendingValidators();
        const pending = pendingValidators.find((i: any) => i.id === payload.nodeId);

        if(pending) {
            context.commit('setNodeStatus', 'Pending');
        } else {
            const currentValidators = await nodeApi.Platform().getCurrentValidators();
            const validator = currentValidators.find((i: any) => i.id === payload.nodeId);
            if(validator) {
                context.commit('setNodeStatus', 'Validating');
            } else {
                context.commit('setNodeStatus', 'Unknown');
            }
        }
    }
}
// Mutations
const mutations = {
    setTxStatus(state: ToolsState, data: any) {
        if (data.bootstrapNode) {
            state.bootstrapTxStatus = data.status;
        } else {
            state.txStatus = data.status;
        }
    },
    setNodeStatus(state: ToolsState, data: string) {
        state.nodeStatus = data;
    },
    setLoading(state: ToolsState, key: string) {
        state.loading.set(key, true)
    },
    cleanState(state: ToolsState) {
        state.txStatus = "";
        state.nodeStatus = "";
        state.bootstrapTxStatus = "";
        state.error = new Map();
        state.loading = new Map();
    },
    setLoaded(state: ToolsState, key: string) {
        state.loading.set(key, false);
    },
    setError(state: ToolsState, errorContext: ErrorContext) {
        state.txStatus = "";
        state.bootstrapTxStatus = "";
        state.loading.set('bootstrapTxCheck', false)
        state.loading.set('nodeTxCheck', false)
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
