import type { PermissionType } from "@othent/kms";

export type AuthMethod = 'arweave' | 'othunt' | null;

export enum WalletConnectionState {
       DISCONNECTED = 'disconnected',
       CONNECTING = 'connecting',
       CONNECTED = 'connected',
       ERROR = 'error'
}

export interface WalletState {
       address: string;
       aowalletState: WalletConnectionState;
       othuntState: WalletConnectionState;
       authMethod: AuthMethod;
       error: string | null;
       balance: string;
}

export const arweavePermissions: PermissionType[] = [
       'ACCESS_ADDRESS',
       'ACCESS_PUBLIC_KEY',
       'ACCESS_ALL_ADDRESSES',
       'SIGN_TRANSACTION',
       'ENCRYPT',
       'DECRYPT',
       'SIGNATURE',
       'ACCESS_ARWEAVE_CONFIG',
       'DISPATCH'
];


// App configuration
export const appConfig = {
       name: 'Velocity',
       logo: 'https://arweave.net/jAvd7Z1CBd8gVF2D6ESj7SMCCUYxDX_z3vpp5aHdaYk',
       gateway: {
              host: "g8way.io",
              port: 443,
              protocol: "https" as "https",
       }
};

export const appInfo = {
       name: appConfig.name,
       version: '1.0.0',
       env: 'production',
}
