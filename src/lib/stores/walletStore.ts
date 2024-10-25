import { writable, derived, type Writable } from 'svelte/store';
import { info, relay } from '$lib/ao/relay';
import { currentUser, user, userRelay } from './profile.store';
import { Othent, type AppInfo, type PermissionType } from '@othent/kms';

// Types
export type AuthMethod = 'arweave' | 'othunt' | null;

export interface WalletState {
       address: string;
       isConnected: boolean;
       isConnecting: boolean;
       authMethod: AuthMethod;
       // profile: Profile;
       error: string | null;
       balance: string;
}

// Initial state
const initialState: WalletState = {
       address: '',
       isConnected: false,
       isConnecting: false,
       authMethod: null,
       error: null,
       balance: '0'
};

// Arweave permissions
const arweavePermissions: PermissionType[] = [
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
const appConfig = {
       name: 'Velocity',
       logo: 'https://arweave.net/jAvd7Z1CBd8gVF2D6ESj7SMCCUYxDX_z3vpp5aHdaYk',

       gateway: {
              host: "g8way.io",
              port: 443,
              protocol: "https" as "https",
       }
};

// export const walletAddress = writable('');
// export const isConnected = writable(false);
// Create and export the wallet store instance

export const walletStore = createWalletStore();


// Derived stores for convenient access
export const walletAddress = derived(walletStore, $store => $store.address);
export const isConnected = derived(walletStore, $store => $store.isConnected);
export const isConnecting = derived(walletStore, $store => $store.isConnecting);
export const authMethod = derived(walletStore, $store => $store.authMethod);
// export const profile = derived(walletStore, $store => $store.profile);
export const walletError = derived(walletStore, $store => $store.error);

// Create wallet store
function createWalletStore() {
       const { subscribe, set, update }: Writable<WalletState> = writable(initialState);

       const othent = new Othent({
              appInfo: {
                     name: appConfig.name,
                     version: '1.0.0',
                     env: 'production',
              }
       });

       return {
              subscribe,
              checkConnecttion: async () => {
                     if (window.arweaveWallet) {
                            try {
                                   // @ts-ignore
                                   const address = await window.arweaveWallet.getActiveAddress();
                                   let _relay = await relay(address);
                                   if (_relay) {
                                          userRelay.set(_relay);
                                          let _currentUser = await info(_relay);
                                          currentUser.set(_currentUser);
                                          user.set(_currentUser);
                                   }
                                   //!! change states
                            } catch (error) {
                                   console.error("Failed to get active address:", error);
                            }
                     }
              },

              // Connect using Arweave browser wallet
              connectArweave: async () => {
                     update(state => ({ ...state, isConnecting: true, error: null }));

                     try {
                            // @ts-ignore
                            if (!window.arweaveWallet) {
                                   throw new Error('Arweave wallet extension not found');
                            }

                            // @ts-ignore
                            await window.arweaveWallet.connect(
                                   arweavePermissions,
                                   appConfig,
                                   appConfig.gateway
                            );

                            // @ts-ignore
                            const address = await window.arweaveWallet.getActiveAddress();

                            update(state => ({
                                   ...state,
                                   address,
                                   isConnected: true,
                                   authMethod: 'arweave',
                                   isConnecting: false
                            }));

                            // await fetchProfile(address);
                            return address;

                     } catch (error) {
                            update(state => ({
                                   ...state,
                                   error: error instanceof Error ? error.message : 'Failed to connect wallet',
                                   isConnecting: false
                            }));
                            throw error;
                     }
              },

              connectOthunt: async () => {
                     update(state => ({ ...state, isConnecting: true, error: null }));
                     var res = await othent.connect();
                     console.log(res);
              },

              disconnect: async () => {
                     try {
                            const state = get(walletStore);

                            if (state.authMethod === 'arweave') {
                                   // @ts-ignore
                                   await window.arweaveWallet?.disconnect();
                            } else if (state.authMethod === 'othunt') {
                                   await othent.disconnect();
                            }
                            set(initialState);

                     } catch (error) {
                            console.error('Error disconnecting:', error);
                            throw error;
                     }
              },

              // Clear error
              clearError: () => {
                     update(state => ({ ...state, error: null }));
              }
       };
}

// Helper function to format address
function formatAddress(address: string): string {
       return `${address.slice(0, 4)}...${address.slice(-4)}`;
}



// Helper function to get store state
function get<T>(store: { subscribe: (callback: (value: T) => void) => () => void }): T {
       let value: T;
       store.subscribe(($value) => value = $value)();
       return value!;
}
