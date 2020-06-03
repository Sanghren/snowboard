// State object
import {ErrorContext} from "@/types";
import {bootstrapNodeApi, nodeApi} from "@/AVA";
import {Actions, Getters, Module, Mutations} from "vuex-smart-module";

class ToolsState {
    nodeStatus = "";
    txStatus = "";
    bootstrapTxStatus = "";
    loading = new Map();
    error = new Map();
}

class ToolsGetters extends Getters<ToolsState> {
    isTxLoading() {
        return this.state.loading.has('bootstrapTxCheck') && this.state.loading.get('bootstrapTxCheck') || this.state.loading.has('nodeTxCheck') && this.state.loading.get('nodeTxCheck')
    }

    isNodeStatusLoading() {
        return this.state.loading.has('nodeStatusCheck') && this.state.loading.get('nodeStatusCheck')
    }

    displayTx() {
        return this.state.bootstrapTxStatus.length > 0 && this.state.txStatus.length > 0;
    }

    displayNodeStatus() {
        return this.state.nodeStatus.length > 0;
    }

    hasError() {
        return (this.state.error.has('bootstrapTxCheck') && this.state.error.get('bootstrapTxCheck')) || (this.state.error.has('nodeTxCheck') && this.state.error.get('nodeTxCheck'))
    }
}

class ToolsMutations extends Mutations<ToolsState> {
    setTxStatus(data: any) {
        if (data.bootstrapNode) {
            this.state.bootstrapTxStatus = data.status;
        } else {
            this.state.txStatus = data.status;
        }
    }

    setNodeStatus(data: string) {
        this.state.nodeStatus = data;
    }

    setLoading(key: string) {
        this.state.loading.set(key, true)
    }

    cleanState() {
        this.state.txStatus = "";
        this.state.nodeStatus = "";
        this.state.bootstrapTxStatus = "";
        this.state.error = new Map();
        this.state.loading = new Map();
    }

    setLoaded(key: string) {
        this.state.loading.set(key, false);
    }

    setError(errorContext: ErrorContext) {
        this.state.txStatus = "";
        this.state.bootstrapTxStatus = "";
        this.state.loading.set('bootstrapTxCheck', false)
        this.state.loading.set('nodeTxCheck', false)
        this.state.error.set(errorContext.key, errorContext.error)
    }
}

class ToolsActions extends Actions<ToolsState,
    ToolsGetters,
    ToolsMutations,
    ToolsActions> {
    async checkTxStatus(txCheck: any) {
        let avmApi;
        const key = txCheck.bootstrapNode ? 'bootstrapTxCheck' : 'nodeTxCheck'
        this.commit('setLoading', key)
        if (txCheck.bootstrap) {
            avmApi = await bootstrapNodeApi.AVM();
        } else {
            avmApi = await nodeApi.AVM();
        }

        try {
            const txStatus = await avmApi.getTxStatus(txCheck.txId);
            this.commit('setTxStatus', {bootstrapNode: txCheck.bootstrapNode, status: txStatus})
            this.commit('setLoaded', key)
        } catch (e) {
            this.commit('setTxStatus', {bootstrapNode: txCheck.bootstrapNode, status: "INVALID"})
            this.commit('setLoaded', key)
            this.commit('setError', {key, error: e})
        }
    }

    async checkBootstrapStatus(payload: any) {
        const pendingValidators = await nodeApi.Platform().getPendingValidators();
        const pending = pendingValidators.find((i: any) => i.id === payload.nodeId);

        if (pending) {
            this.commit('setNodeStatus', 'Pending');
        } else {
            const currentValidators = await nodeApi.Platform().getCurrentValidators();
            const validator = currentValidators.find((i: any) => i.id === payload.nodeId);
            if (validator) {
                this.commit('setNodeStatus', 'Validating');
            } else {
                this.commit('setNodeStatus', 'Unknown');
            }
        }
    }
}

export const Tools = new Module({
    state: ToolsState,
    getters: ToolsGetters,
    mutations: ToolsMutations,
    actions: ToolsActions
})
