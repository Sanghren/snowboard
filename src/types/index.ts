export interface IKeystoreState {
    users: IUser[],
}

export interface IMetricsState {
    nodeDown: boolean,
    nodeUrl: string,
    metrics: object[]
}

export interface  IUser {
    name: string;
    password?: string;
    exportData?: string;
}
