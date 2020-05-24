export interface KeystoreState {
    users: User[];
}

export interface MetricsState {
    nodeDown: boolean;
    nodeUrl: string;
    metrics: object[];
}

export interface AdminState {
    nodeId: string;
    peers: string[];
    networkId: string;

}


export interface PChainState {
    blockchains: Blockchain[];
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

export interface User {
    name: string;
    password?: string;
    exportData?: string;
}
