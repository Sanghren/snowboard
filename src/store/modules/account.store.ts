// State object
import {
    AssetBalance,
    ErrorContext, ExportAvaPChain, ImportAvaPChain,
    PAddressExport,
    PAddressImport,
    PChainAccount, UpdateAssetBalance,
    User,
    XAddressExport,
    XAddressImport,
    XChainAddress,
    ExportAvaXChain,
    SignTxPChain, ImportAvaXChain, Subnet
} from "@/types";
import {bootstrapNodeApi, nodeApi} from "@/AVA";
import {Actions, createMapper, Getters, Module, Mutations} from "vuex-smart-module";
import jdenticon from 'jdenticon';
import BN from 'bn.js';

class AccountState {
    xAddressPKey = "";
    xAddresses: XChainAddress[] = [];
    txId = "";
    txStatus = "";
    pAccounts: PChainAccount[] = [];
    loading = new Map();
    error: string[] = [];
    showError = false;
    subnets :Subnet[] = [];
}

class AccountGetters extends Getters<AccountState> {
}

class AccountMutations extends Mutations<AccountState> {

    setPAccounts(pAccounts: PChainAccount[]) {
        this.state.pAccounts = pAccounts;
    }

    setXaddressPKey(xAddressPKey: string) {
        this.state.xAddressPKey = xAddressPKey;
    }

    setXAddress(xChain: XChainAddress[]) {
        this.state.xAddresses = xChain;
    }

    setTx(txId: string) {
        this.state.txId = txId
    }

    setTxStatus(txStatus: string) {
        this.state.txStatus = txStatus
    }

    pushAddress(address: XChainAddress) {
        this.state.xAddresses.push(address)
    }

    pushPAccount(account: PChainAccount) {
        this.state.pAccounts.push(account)
    }

    setPAccountPKey(update: { pKey: string, address: string }) {
        const toUpdate = this.state.pAccounts.find((i: PChainAccount) => i.address === update.address)
        if (toUpdate)
            toUpdate.privateKey = update.pKey
    }

    setXAddressBalance(update: UpdateAssetBalance) {
        const toUpdate = this.state.xAddresses.find((i: XChainAddress) => i.address === update.address)
        if (toUpdate)
            toUpdate.assets = update.balances
    }

    setLoading(key: string) {
        this.state.loading.set(key, true)
    }

    setLoaded(key: string) {
        this.state.loading.set(key, false);
    }

    setSubnets(data: Subnet[]) {
        this.state.subnets = data;
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
        this.state.xAddressPKey = "";
        this.state.xAddresses = [];
        this.state.txId = "";
        this.state.txStatus = "";
        this.state.pAccounts = [];
        this.state.loading = new Map();
        this.state.error = [];
        this.state.showError = false;
    }
}

class AccountActions extends Actions<AccountState,
    AccountGetters,
    AccountMutations,
    Actions> {

    async markErrorAsShown() {
        this.mutations.setShowError();
        this.mutations.resetError();
    }

    async signTx(data: SignTxPChain) {
        const api = nodeApi;
        this.mutations.setLoading('signTx');
        try {
            const tx = await api.Platform().sign(data.username, data.password, data.tx, data.signer);
            this.mutations.setTxStatus('')
            this.mutations.setTx(tx)
            this.mutations.setLoaded('signTx')
            return true;
        } catch (e) {
            this.mutations.setLoaded('signTx');
            this.mutations.setError({key: 'signTx', error: e})
            return false;
        }
    }

    async issueTx() {
        const api = nodeApi;
        this.mutations.setLoading('issueTx');
        try {
            const tx = await api.Platform().issueTx(this.state.txId);
            this.mutations.setTxStatus('')
            this.mutations.setTx(tx)
            this.mutations.setLoaded('issueTx')
            return true;
        } catch (e) {
            this.mutations.setLoaded('issueTx');
            this.mutations.setError({key: 'issueTx', error: e})
            return false;
        }
    }

    async importAvaFromPChain(data: ImportAvaXChain) {
        const api = nodeApi;
        this.mutations.setLoading('importAvaFromPChain');
        try {
            const tx = await api.AVM().importAVA(data.username, data.password, data.to);
            this.mutations.setTx(tx)
            this.mutations.setLoaded('importAvaFromPChain')
            return true;
        } catch (e) {
            this.mutations.setLoaded('importAvaFromPChain');
            this.mutations.setError({key: 'importAvaFromPChain', error: e})
            return false;
        }
    }

    async listXAddresses(user: User) {
        const api = nodeApi;
        this.mutations.setLoading('listXAddresses');
        if (!user.name || !user.password) {
            this.mutations.setLoaded('listXAddresses');
            this.mutations.setError({key: 'listXAddresses', error: new Error('Missing params')})
            return false;
        }
        try {
            const addresses = await api.AVM().listAddresses(user.name, user.password);
            const xAddresses = addresses.map((a: string) => {
                return {
                    address: a,
                    identicon: jdenticon.toSvg(a, 60),
                    assets: [{
                        asset: "",
                        balance: -1
                    } as AssetBalance]
                } as XChainAddress
            })
            this.mutations.setXAddress(xAddresses)
            addresses.map(async (a: string) => {
                await this.getBalances(a)
            })
            this.mutations.setLoaded('listXAddresses')
        } catch (e) {
            this.mutations.setLoaded('listXAddresses');
            this.mutations.setError({key: 'listXAddresses', error: e})
        }
    }

    async listPAccounts(user: User) {
        const api = nodeApi;
        this.mutations.setLoading('listPAccounts');
        if (!user.name || !user.password) {
            this.mutations.setLoaded('listPAccounts');
            this.mutations.setError({key: 'listPAccounts', error: new Error('Missing params')})
            return false;
        }
        try {
            const accounts = await api.Platform().listAccounts(user.name, user.password) as PChainAccount[];
            accounts.forEach(account => {
                account.identicon = jdenticon.toSvg(account.address, 60)
            })
            this.mutations.setPAccounts(accounts)
            this.mutations.setLoaded('listPAccounts')
        } catch (e) {
            this.mutations.setLoaded('listPAccounts');
            this.mutations.setError({key: 'listPAccounts', error: e})
        }
    }

    async exportAvaToPChain(data: ExportAvaPChain) {
        const api = nodeApi;
        this.mutations.setLoading('exportAvaToPChain');
        if (!data.username || !data.password || !data.to || data.amount < 0) {
            this.mutations.setLoaded('exportAvaToPChain');
            this.mutations.setError({key: 'exportAvaToPChain', error: new Error('Missing params')})
            return false;
        }
        try {
            const txId = await api.AVM().exportAVA(data.username, data.password, data.to, new BN(data.amount));
            this.mutations.setTxStatus('')
            this.mutations.setTx(txId)
            this.mutations.setLoaded('exportAvaToPChain')
            return true
        } catch (e) {
            this.mutations.setLoaded('exportAvaToPChain');
            this.mutations.setError({key: 'exportAvaToPChain', error: e})
            return false
        }
    }

    async exportAvaToXChain(data: ExportAvaXChain) {
        const api = nodeApi;
        this.mutations.setLoading('exportAvaToXChain');
        if (data.amount < 1 || !data.to || data.nonce < 0) {
            this.mutations.setLoaded('exportAvaToXChain');
            this.mutations.setError({key: 'exportAvaToXChain', error: new Error('Missing params')})
            return false;
        }
        try {
            const txId = await api.Platform().exportAVA(new BN(data.amount), data.to.substring(2, data.to.length), data.nonce);
            this.mutations.setTxStatus('')
            this.mutations.setTx(txId)
            this.mutations.setLoaded('exportAvaToXChain')
            return true
        } catch (e) {
            this.mutations.setLoaded('exportAvaToXChain');
            this.mutations.setError({key: 'exportAvaToXChain', error: e})
            return false
        }
    }

    async importAvaFromXChain(data: ImportAvaPChain) {
        const api = nodeApi;
        this.mutations.setLoading('importAvaFromXChain');
        if (!data.username || !data.password || !data.to || data.nonce <= 0) {
            this.mutations.setLoaded('importAvaFromXChain');
            this.mutations.setError({key: 'importAvaFromXChain', error: new Error('Missing params')})
            return false;
        }
        try {
            const rawTx = await api.Platform().importAVA(data.username, data.password, data.to, data.nonce)
            this.mutations.setTxStatus('')
            const txId = await api.Platform().issueTx(rawTx);
            this.mutations.setTxStatus('')
            this.mutations.setTx(txId)
            this.mutations.setLoaded('importAvaFromXChain')
            return true
        } catch (e) {
            this.mutations.setLoaded('importAvaFromXChain');
            this.mutations.setError({key: 'importAvaFromXChain', error: e})
            return false
        }
    }

    async checkTxStatus(payload: { txId: string, timeout: NodeJS.Timeout }) {
        const avmApi = await nodeApi.AVM()
        this.mutations.setLoading('checkTxStatus')

        try {
            const txStatus = await avmApi.getTxStatus(payload.txId);
            this.mutations.setTxStatus(txStatus)
            if (txStatus.toUpperCase() === 'ACCEPTED') {
                clearInterval(payload.timeout)
            }
            this.mutations.setLoaded('checkTxStatus')
        } catch (e) {
            this.mutations.setTxStatus("INVALID")
            this.mutations.setLoaded('checkTxStatus')
            this.mutations.setError({key: 'checkTxStatus', error: e})
        }
    }

    async addDefaultSubnetValidator(data: { id:string, startTime:Date, endTime:Date, stakeAmount:BN, payerNonce:number, destination:string, delegationFeeRate:BN }) {
        const api = await nodeApi.Platform()
        this.mutations.setLoading('addDefaultSubnetValidator')
        try {
            const unsignedTx = await api.addDefaultSubnetValidator(data.id, data.startTime, data.endTime, data.stakeAmount, ++data.payerNonce, data.destination, data.delegationFeeRate);
            this.mutations.setLoaded('addDefaultSubnetValidator')
            return unsignedTx
        } catch (e) {
            this.mutations.setLoaded('addDefaultSubnetValidator')
            this.mutations.setError({key: 'addDefaultSubnetValidator', error: e})
            return undefined;
        }
    }

    async addNonDefaultSubnetValidator(data: { nodeId:string, subnetId: string, startTime:Date, endTime:Date, stakeAmount:BN, payerNonce:number,weight: number}) {
        const api = await nodeApi.Platform()
        this.mutations.setLoading('addNonDefaultSubnetValidator')
        try {
            const unsignedTx = await api.addNonDefaultSubnetValidator(data.nodeId, data.subnetId, data.startTime, data.endTime, data.weight, ++data.payerNonce );
            this.mutations.setLoaded('addNonDefaultSubnetValidator')
            return unsignedTx
        } catch (e) {
            this.mutations.setLoaded('addNonDefaultSubnetValidator')
            this.mutations.setError({key: 'addNonDefaultSubnetValidator', error: e})
            return undefined;
        }
    }

    async getBalances(address: string) {
        const api = nodeApi
        let updateBalances: AssetBalance[] = []
        this.mutations.setLoading('getBalances');
        try {
            const balances = await api.AVM().getAllBalances(address) as AssetBalance[]
            if (balances.length > 0) {
                updateBalances = balances.map((balance: AssetBalance) => {
                    return {
                        balance: balance.balance,
                        asset: balance.asset,
                    } as AssetBalance
                })
            } else {
                updateBalances = [{
                    balance: 0,
                    asset: "AVA"
                }] as AssetBalance[]
            }

            this.mutations.setXAddressBalance({address, balances: updateBalances} as UpdateAssetBalance)
            this.mutations.setLoaded('getBalances');
        } catch (e) {
            this.mutations.setLoaded('getBalances');
            this.mutations.setError({key: 'getBalances', error: e})
        }
    }

    async createXAddresse(user: User) {
        const api = nodeApi;
        this.mutations.setLoading('createXAddresse');
        if (!user.name || !user.password) {
            this.mutations.setLoaded('createXAddresse');
            this.mutations.setError({key: 'createXAddresse', error: new Error('Missing params')})
            return false;
        }
        try {
            const address = await api.AVM().createAddress(user.name, user.password)
            const xChainAddress = {
                address,
                identicon: jdenticon.toSvg(address, 60),
                assets: [{
                    asset: "",
                    balance: -1
                } as AssetBalance]
            } as XChainAddress

            await this.getBalances(address)

            this.mutations.pushAddress(xChainAddress)
            this.mutations.setLoaded('createXAddresse');
        } catch (e) {
            this.mutations.setLoaded('createXAddresse');
            this.mutations.setError({key: 'createXAddresse', error: e})
        }
    }

    async importXAddress(user: XAddressImport) {
        const api = nodeApi;
        this.mutations.setLoading('importXAddress');
        if (!user.name || !user.password || !user.privateKey) {
            this.mutations.setLoaded('importXAddress');
            this.mutations.setError({key: 'importXAddress', error: new Error('Missing params')})
            return false;
        }
        try {
            const address = await api.AVM().importKey(user.name, user.password, user.privateKey)
            const xChainAddress = {
                address,
                identicon: jdenticon.toSvg(address, 60),
                assets: [{
                    asset: "",
                    balance: -1
                } as AssetBalance]
            } as XChainAddress
            await this.getBalances(address)
            this.dispatch
            this.mutations.pushAddress(xChainAddress)
            this.mutations.setLoaded('importXAddress');
        } catch (e) {
            this.mutations.setLoaded('importXAddress');
            this.mutations.setError({key: 'importXAddress', error: e})
        }
    }

    async exportXAddress(user: XAddressExport) {
        const api = nodeApi;
        this.mutations.setLoading('exportXAddress');
        if (!user.name || !user.password || !user.address) {
            this.mutations.setLoaded('exportXAddress');
            this.mutations.setError({key: 'exportXAddress', error: new Error('Missing params')})
            return "";
        }
        try {
            const pKey = await api.AVM().exportKey(user.name, user.password, user.address)
            this.mutations.setXaddressPKey(pKey)
            this.mutations.setLoaded('exportXAddress');
            return pKey;
        } catch (e) {
            this.mutations.setLoaded('exportXAddress');
            this.mutations.setError({key: 'exportXAddress', error: e})
        }
    }

    async createPAccount(user: User) {
        const api = nodeApi;
        this.mutations.setLoading('createPAccount');
        if (!user.name || !user.password) {
            this.mutations.setLoaded('createPAccount');
            this.mutations.setError({key: 'createPAccount', error: new Error('Missing params')})
            return false;
        }
        try {
            const pAddress = await api.Platform().createAccount(user.name, user.password)
            const pAccount = await api.Platform().getAccount(pAddress) as PChainAccount
            pAccount.identicon = jdenticon.toSvg(pAccount.address, 60)
            this.mutations.pushPAccount(pAccount)
            this.mutations.setLoaded('createPAccount');
        } catch (e) {
            this.mutations.setLoaded('createPAccount');
            this.mutations.setError({key: 'createPAccount', error: e})
        }
    }

    async exportPAccountKey(user: PAddressExport) {
        const api = nodeApi;
        this.mutations.setLoading('exportPAccountKey');
        if (!user.name || !user.password || !user.address) {
            this.mutations.setLoaded('exportPAccountKey');
            this.mutations.setError({key: 'exportPAccountKey', error: new Error('Missing params')})
            return "";
        }
        try {
            const pAccountKey = await api.Platform().exportKey(user.name, user.password, user.address);
            this.mutations.setPAccountPKey({pKey: pAccountKey, address: user.address})
            this.mutations.setLoaded('exportPAccountKey');
            return pAccountKey
        } catch (e) {
            this.mutations.setLoaded('exportPAccountKey');
            this.mutations.setError({key: 'exportPAccountKey', error: e})
        }
    }

    async importPAccountKey(user: PAddressImport) {
        const api = nodeApi;
        this.mutations.setLoading('importPAccountKey');
        if (!user.name || !user.password || !user.privateKey) {
            this.mutations.setLoaded('importPAccountKey');
            this.mutations.setError({key: 'importPAccountKey', error: new Error('Missing params')})
            return false;
        }
        try {
            const pAddress = await api.Platform().importKey(user.name, user.password, user.privateKey);
            const pAccount = await api.Platform().getAccount(pAddress) as PChainAccount
            pAccount.identicon = jdenticon.toSvg(pAccount.address, 60)
            this.mutations.pushPAccount(pAccount)
            this.mutations.setLoaded('importPAccountKey');
        } catch (e) {
            this.mutations.setLoaded('importPAccountKey');
            this.mutations.setError({key: 'importPAccountKey', error: e})
        }
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

export const Account = new Module({
    state: AccountState,
    getters: AccountGetters,
    mutations: AccountMutations,
    actions: AccountActions
})

export const AccountMapper = createMapper(Account)
