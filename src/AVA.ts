import * as slopes from "slopes";
import {Config} from "@/types";

const bootstrapNodeHost = process.env.VUE_APP_SNWBRD_BOOTSTRAP_HOST || 'bootstrap.ava.network';
const bootstrapProtocol = process.env.VUE_APP_SNWBRD_BOOTSTRAP_PROTOCOL || 'https';
const bootstrapChainId = process.env.VUE_APP_SNWBRD_BOOTSTRAP_CHAIN_ID || 'X';
const bootstrapNodePort = process.env.VUE_APP_SNWBRD_BOOTSTRAP_PORT || '2100';
const bootstrapNetworkId = process.env.VUE_APP_SNWBRD_BOOTSTRAP_NETWORK_ID || '4ktRjsAKxgMr2aEzv9SWmrU7Xk5FniHUrVCX4P1TZSfTLZWFM';

const nodeHost = process.env.VUE_APP_SNWBRD_NODE_HOST || 'localhost';
const protocol = process.env.VUE_APP_SNWBRD_NODE_PROTOCOL || 'http';
const chainId = process.env.VUE_APP_SNWBRD_NODE_CHAIN_ID || 'X';
const nodePort = process.env.VUE_APP_SNWBRD_NODE_PORT || '9650';
const networkId = process.env.VUE_APP_SNWBRD_NODE_NETWORK_ID || '4ktRjsAKxgMr2aEzv9SWmrU7Xk5FniHUrVCX4P1TZSfTLZWFM';

let nodeApi = new slopes.Slopes(nodeHost, parseInt(nodePort), protocol, parseInt(networkId), chainId);
const bootstrapNodeApi = new slopes.Slopes(bootstrapNodeHost, parseInt(bootstrapNodePort), bootstrapProtocol, parseInt(bootstrapNetworkId), bootstrapChainId);

export function updateSlopesApi(config: Config) {
    nodeApi = new slopes.Slopes(
        config.nodeUrl,
        parseInt(config.nodePort),
        config.protocol,
        parseInt(config.networkId),
        config.chainId
    )
}

export {nodeApi, bootstrapNodeApi};
