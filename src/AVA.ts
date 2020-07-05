import {Avalanche} from "avalanche";
import {Config} from "@/types";

const bootstrapNodeHost = process.env.VUE_APP_SNWBRD_BOOTSTRAP_HOST || window.VUE_APP_SNWBRD_BOOTSTRAP_HOST || 'bootstrap.avax.network';
const bootstrapProtocol = process.env.VUE_APP_SNWBRD_BOOTSTRAP_PROTOCOL || window.VUE_APP_SNWBRD_BOOTSTRAP_PROTOCOL || 'https';
const bootstrapChainId = process.env.VUE_APP_SNWBRD_BOOTSTRAP_CHAIN_ID || window.VUE_APP_SNWBRD_BOOTSTRAP_CHAIN_ID || 'X';
const bootstrapNodePort = process.env.VUE_APP_SNWBRD_BOOTSTRAP_PORT || window.VUE_APP_SNWBRD_BOOTSTRAP_PORT || '21000';
const bootstrapNetworkId = process.env.VUE_APP_SNWBRD_BOOTSTRAP_NETWORK_ID || window.VUE_APP_SNWBRD_BOOTSTRAP_NETWORK_ID || '3';

const keystoreCreation = process.env.VUE_APP_SNWBRD_DISABLED_KEYSTORE_CREATION || window.VUE_APP_SNWBRD_DISABLED_KEYSTORE_CREATION || "false";

export const nodeHost = process.env.VUE_APP_SNWBRD_NODE_HOST || window.VUE_APP_SNWBRD_NODE_HOST || 'bootstrap.avax.network';
export const protocol = process.env.VUE_APP_SNWBRD_NODE_PROTOCOL || window.VUE_APP_SNWBRD_NODE_PROTOCOL || 'https';
export const chainId = process.env.VUE_APP_SNWBRD_NODE_CHAIN_ID || window.VUE_APP_SNWBRD_NODE_CHAIN_ID || 'X';
export const nodePort = process.env.VUE_APP_SNWBRD_NODE_PORT || window.VUE_APP_SNWBRD_NODE_PORT || '21000';
export const networkId = process.env.VUE_APP_SNWBRD_NODE_NETWORK_ID || window.VUE_APP_SNWBRD_NODE_NETWORK_ID || '3';

let nodeApi = new Avalanche(nodeHost, parseInt(nodePort), protocol, parseInt(networkId), chainId);
const bootstrapNodeApi = new Avalanche(bootstrapNodeHost, parseInt(bootstrapNodePort), bootstrapProtocol, parseInt(bootstrapNetworkId), bootstrapChainId);

export function updateAvalancheApi(config: Config): void {
    nodeApi = new Avalanche(
        config.nodeUrl,
        parseInt(config.nodePort),
        config.protocol,
        parseInt(config.networkId),
        config.chainId
    )
}

export {nodeApi, bootstrapNodeApi, keystoreCreation};
