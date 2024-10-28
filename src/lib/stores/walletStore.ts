import { writable } from 'svelte/store';
import { WalletConnectionState, type AuthMethod } from '$lib/models/wallet';


export const walletAddress = writable('');
export const isConnected = writable(false);

export const authMethod = writable<AuthMethod>(null);

export const aoWalletState = writable(WalletConnectionState.DISCONNECTED);
export const othuntWalletState = writable(WalletConnectionState.DISCONNECTED);

export const walletError = writable<string | null>(null);