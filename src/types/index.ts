export interface KeystoreState {
    users: User[];
}

export interface HealthState {
    //ToDo Type that properly
    checks: object;
    healthy: boolean;
}

export interface MetricsState {
    nodeDown: boolean;
    nodeUrl: string;
    bootstrapNodeUrl: string;
    metrics: Metric[];
}

export interface AdminState {
    nodeId: string;
    validator: ValidatorStatus;
    peers: string[];
    networkId: string;

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

export interface Metric {
    help: string;
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

export interface Validator {
    startTime: number;
    endTime: number;
    stakeAmount: number;
    id: string;
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
 nonce: number;
 balance: number;
}

export interface User {
    name: string;
    password?: string;
    exportData?: string;
    accounts?: PChainAccount[];
}
