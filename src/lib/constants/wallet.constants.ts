import type {
  PermissionType,
  GatewayConfig,
} from "../../../node_modules/arconnect";

export const PERMISSIONS: PermissionType[] = [
  "ACCESS_ADDRESS",
  "ACCESS_PUBLIC_KEY",
  "ACCESS_ALL_ADDRESSES",
  "SIGN_TRANSACTION",
  "ENCRYPT",
  "DECRYPT",
  "SIGNATURE",
  "ACCESS_ARWEAVE_CONFIG",
  "DISPATCH",
];

export const APP_INFO = {
  name: "Super Cool App",
  logo: "https://arweave.net/jAvd7Z1CBd8gVF2D6ESj7SMCCUYxDX_z3vpp5aHdaYk",
};

export const GATEWAY: GatewayConfig = {
  host: "g8way.io",
  port: 443,
  protocol: "https",
};
