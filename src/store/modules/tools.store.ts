// State object
import {ErrorContext, Validator} from "@/types";
import {bootstrapNodeApi, nodeApi} from "@/AVA";
import {Actions, createMapper, Getters, Module, Mutations} from "vuex-smart-module";


interface TxStatusUpdate {
    bootstrapNode: boolean;
    status?: string;
    txId?: string;
}

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
        console.log(this.state.bootstrapTxStatus.length)
        console.log(this.state.txStatus.length)
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
    setTxStatus(data: TxStatusUpdate) {
        console.log("BOUHHHHH ", data)
        if (data.bootstrapNode) {
            this.state.bootstrapTxStatus = data.status || "UNKNOWN";
        } else {
            this.state.txStatus = data.status || "UNKNOWN";
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
    async checkTxStatus(txCheck: TxStatusUpdate) {
        let avmApi;
        const key = txCheck.bootstrapNode ? 'bootstrapTxCheck' : 'nodeTxCheck'
        this.mutations.setLoading(key)
        if (txCheck.bootstrapNode) {
            avmApi = await bootstrapNodeApi.AVM();
        } else {
            avmApi = await nodeApi.AVM();
        }
        try {
            if (txCheck.txId) {
                const txStatus = await avmApi.getTxStatus(txCheck.txId);
                this.mutations.setTxStatus({bootstrapNode: txCheck.bootstrapNode, status: txStatus})
                this.mutations.setLoaded(key)
            }
        } catch (e) {
            this.mutations.setTxStatus({bootstrapNode: txCheck.bootstrapNode, status: "INVALID"})
            this.mutations.setLoaded(key)
            this.mutations.setError({key, error: e})
        }
    }

    async checkNodeStatus(nodeId: string) {
        const pendingValidators = await nodeApi.Platform().getPendingValidators() as Validator[];
        const pending = pendingValidators.find((i: Validator) => i.id === nodeId);

        if (pending) {
            this.mutations.setNodeStatus('Pending');
        } else {
            const currentValidators = await nodeApi.Platform().getCurrentValidators() as Validator[];
            const validator = currentValidators.find((i: Validator) => i.id === nodeId);
            if (validator) {
                this.mutations.setNodeStatus('Validating');
            } else {
                this.mutations.setNodeStatus('Unknown');
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
export const ToolsMapper = createMapper(Tools)
