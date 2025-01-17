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
  name: "Velocity",
  logo: "https://www.arweave.net/HdqPvO3mOZwjJnIT0T8-FjNh9W4ctnUeDUihbrOAvN4",
};

export const GATEWAY: GatewayConfig = {
  host: "g8way.io",
  port: 443,
  protocol: "https",
};
