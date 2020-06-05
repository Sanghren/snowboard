// State object
import {ErrorContext, PlatformAccount, Validator} from "@/types";
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
    pAccount: PlatformAccount = {address: "", balance: 0, nonce: 0}
    bootstrapTxStatus = "";
    loading = new Map();
    error = new Map();
}

class ToolsGetters extends Getters<ToolsState> {
    get isTxLoading() {
        return this.state.loading.has('bootstrapTxCheck') && this.state.loading.get('bootstrapTxCheck') || this.state.loading.has('nodeTxCheck') && this.state.loading.get('nodeTxCheck')
    }

    get isNodeStatusLoading() {
        return this.state.loading.has('nodeStatusCheck') && this.state.loading.get('nodeStatusCheck')
    }

    get isGetAccountLoading() {
        return this.state.loading.has('getAccount') && this.state.loading.get('getAccount')
    }

    get displayTx() {
        return this.state.bootstrapTxStatus.length > 0 && this.state.txStatus.length > 0
    }

    get getErrors(){
        const keys = this.state.error.keys();
        const errors = [];
        console.log(`BOUH 1- ${JSON.stringify(keys)}`)
        for (const key of keys) {
            console.log(`BOUH 2- ${key}`)
            errors.push(this.state.error.get(key));
        }
        console.log(`BOUH 3- ${errors}`)

        return errors;
    }

    get displayPAccount() {
        return this.state.pAccount.address.length > 0
    }

    get displayNodeStatus() {
        return this.state.nodeStatus.length > 0
    }

    hasError() {
        return (this.state.error.has('bootstrapTxCheck') && this.state.error.get('bootstrapTxCheck')) || (this.state.error.has('nodeTxCheck') && this.state.error.get('nodeTxCheck'))
    }
}

class ToolsMutations extends Mutations<ToolsState> {
    setTxStatus(data: TxStatusUpdate) {
        if (data.bootstrapNode) {
            this.state.bootstrapTxStatus = data.status || "UNKNOWN"
        } else {
            this.state.txStatus = data.status || "UNKNOWN"
        }
    }

    setNodeStatus(data: string) {
        this.state.nodeStatus = data;
    }

    setPAccount(data: PlatformAccount) {
        this.state.pAccount = data;
    }

    setLoading(key: string) {
        this.state.loading.set(key, true)
    }

    cleanState() {
        this.state.txStatus = ""
        this.state.nodeStatus = ""
        this.state.pAccount = {address: "", balance: 0, nonce: 0}
        this.state.bootstrapTxStatus = ""
        this.state.error = new Map()
        this.state.loading = new Map()
    }

    setLoaded(key: string) {
        this.state.loading.set(key, false);
    }

    setError(errorContext: ErrorContext) {
        this.state.txStatus = "";
        this.state.bootstrapTxStatus = "";
        this.state.loading.set('bootstrapTxCheck', false)
        this.state.loading.set('nodeTxCheck', false)
        this.state.loading.set('getAccount', false)
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
            avmApi = await bootstrapNodeApi.AVM()
        } else {
            avmApi = await nodeApi.AVM()
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

    async getAccount(address: string) {
        const platformApi = await nodeApi.Platform();
        this.mutations.setLoading('getAccount')

        try {
            const account = await platformApi.getAccount(address) as PlatformAccount
            console.log(account);
            this.mutations.setPAccount(account)
            this.mutations.setLoaded('getAccount')
        } catch (e) {
            this.mutations.setLoaded('getAccount')
            this.mutations.setError({key: 'getAccount', error: e})

        }

    }

    async checkNodeStatus(nodeId: string) {
        const pendingValidators = await nodeApi.Platform().getPendingValidators() as Validator[];
        const pending = pendingValidators.find((i: Validator) => i.id === nodeId)

        if (pending) {
            this.mutations.setNodeStatus('Pending');
        } else {
            const currentValidators = await nodeApi.Platform().getCurrentValidators() as Validator[];
            const validator = currentValidators.find((i: Validator) => i.id === nodeId)
            if (validator) {
                this.mutations.setNodeStatus('Validating')
            } else {
                this.mutations.setNodeStatus('Unknown')
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
