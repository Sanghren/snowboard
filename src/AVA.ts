import * as slopes from "slopes";
import {Config} from "@/types";

const bootstrapNodeHost = process.env.VUE_APP_SNWBRD_BOOTSTRAP_HOST || 'bootstrap.ava.network';
const bootstrapProtocol = process.env.VUE_APP_SNWBRD_BOOTSTRAP_PROTOCOL || 'https';
const bootstrapChainId = process.env.VUE_APP_SNWBRD_BOOTSTRAP_CHAIN_ID || 'X';
const bootstrapNodePort = process.env.VUE_APP_SNWBRD_BOOTSTRAP_PORT || '2100';
const bootstrapNetworkId = process.env.VUE_APP_SNWBRD_BOOTSTRAP_NETWORK_ID || '3';

const nodeHost = process.env.VUE_APP_SNWBRD_NODE_HOST || 'bootstrap.ava.network';
const protocol = process.env.VUE_APP_SNWBRD_NODE_PROTOCOL || 'https';
const chainId = process.env.VUE_APP_SNWBRD_NODE_CHAIN_ID || 'X';
const nodePort = process.env.VUE_APP_SNWBRD_NODE_PORT || '2100';
const networkId = process.env.VUE_APP_SNWBRD_NODE_NETWORK_ID || '3';

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
