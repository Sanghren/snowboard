export interface ErrorContext {
    key: string;
    error: Error;
}

export interface PChainState {
    blockchains: Blockchain[];
    validators: Validator[];
}

export interface XChainState {
    bootstrapped: boolean;
    balance: XBalance;
    txs: TxStatusRes[];
}

export interface Config {
    nodeUrl: string;
    protocol: string;
    chainId: string;
    nodePort: string;
    networkId: string;
}

interface State {
    loading: Map<string, boolean>;
    error: Map<string, Error>;
}

export interface Validator {
    startTime: number;
    endTime: number;
    stakeAmount: number;
    address: string;
    weight?: number;
    stakeMount?: number;
    id: string;
}

export interface PlatformAccount {
    address: string;
    nonce: number;
    balance: number;
}

export interface HealthCheck {
    networkValidatorsHeartbeat: {
        message: {
            heartbeat: number;
        }
    };
    timestamp: string;
    duration: number;
    contiguousFailures: number;
    timeOfFirstFailure: number;
}

export interface Metric {
    help: string;
    //ToDo Type this properly
    // eslint-disable-next-line @typescript-eslint/ban-types
    metrics: object[];
    name: string;
    type: string;
}

interface UtxoId {
    txID: string;
    outputIndex: number;
}

export interface XBalance {
    balance: number;
    utxoIDs: UtxoId[];
}

export interface TxStatusRes {
    txId: string;
    txStatusOwnNode: string;
    txStatusBootstrapNode: string;
}

export interface TxStatusUdate {
    txId: string;
    ownNode: boolean;
    txStatus: string;
}

export interface Blockchain {
    id: string;
    name: string;
    subnetID: string;
    vmID: string;
    status: BlockchainStatus;
}

export enum BlockchainStatus {
    VALIDATING,
    CREATED,
    PREFERRED,
    UNKNOWN
}

export enum ValidatorStatus {
    PENDING,
    VALIDATING,
    UNKNOWN
}

export interface PChainAccount {
    address: string;
    privateKey: string;
    identicon: string;
    nonce: number;
    balance: number;
}

export interface XChainAddress {
    address: string;
    privateKey?: string;
    identicon: string;
    assets: AssetBalance[];
}

export interface AssetBalance {
    asset: string;
    balance: number;
}

export interface UpdateAssetBalance {
    address: string;
    balances: AssetBalance[]
}

export interface User {
    name: string;
    password?: string;
    exportData?: string;
    accounts?: PChainAccount[];
}

export interface PAddressExport {
    name: string;
    password: string;
    address: string;
}

export interface PAddressImport {
    name: string;
    password: string;
    privateKey: string;
}

export interface XAddressExport {
    name: string;
    password: string;
    address: string;
}

export interface XAddressImport {
    name: string;
    password: string;
    privateKey: string;
}
