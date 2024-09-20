<script>
    import { onMount } from 'svelte';
    import { walletAddress, setWalletAddress, clearWalletAddress } from '../stores/walletStore';
    import SmallSpinner from '$lib/components/smallSpinner.svelte';
    import { relay, info } from '$lib/ao/relay';
    import { currentUser, userRelay } from '../stores/profile.store';

    export let buttonClass = "";

    let title = 'Connect Wallet';
    let isLoading = false;
    let isConnected = false;

    $: if ($walletAddress) {
        title = formatAddress($walletAddress);
        isConnected = true;
    } else {
        title = 'Connect Wallet';
        isConnected = false;
    }

    onMount(async () => {
        await checkWalletConnection();
    });

    async function checkWalletConnection() {
        if (window.arweaveWallet) {
            try {
                const address = await window.arweaveWallet.getActiveAddress();
                //let _relay = await relay(address)
                //let _currentUser = await info(_relay)
                //currentUser.set(_currentUser)
                //userRelay.set(_relay)
                setWalletAddress(address);
                title = "Disconnect";
            } catch (error) {
                //console.error('Failed to get active address:', error);
                
            }
        }
    }

	//@ts-ignore
    function formatAddress(address) {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }
    
    const connectWallet = async () => {
        if (isConnected) {
            await disconnectWallet();
            return;
        }

        title = "Connecting";
        isLoading = true;
        try {
            await window.arweaveWallet.connect(
                [
                    'ACCESS_ADDRESS',
                    'ACCESS_PUBLIC_KEY',
                    'ACCESS_ALL_ADDRESSES',
                    'SIGN_TRANSACTION',
                    'ENCRYPT',
                    'DECRYPT',
                    'SIGNATURE',
                    'ACCESS_ARWEAVE_CONFIG',
                    'DISPATCH'
                ],
                {
                    name: 'Super Cool App',
                    logo: 'https://arweave.net/jAvd7Z1CBd8gVF2D6ESj7SMCCUYxDX_z3vpp5aHdaYk'
                },
                {
                    host: 'g8way.io',
                    port: 443,
                    protocol: 'https'
                }
            );
            console.log('Wallet connected successfully');
            await checkWalletConnection();
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            title = "Connect Wallet";
        } finally {
            isLoading = false;
        }
    };

    const disconnectWallet = async () => {
        title = "Disconnecting";
        isLoading = true;
        try {
            await window.arweaveWallet.disconnect();
            console.log('Wallet disconnected successfully');
            clearWalletAddress();
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
        } finally {
            isLoading = false;
        }
    };
</script>

<button
  on:click={connectWallet}
  type="button"
  class={`btn justify-center self-stretch px-4 py-2 text-sm rounded ${buttonClass}`}
  tabindex="0"
>
  {#if isLoading}
    <div class="flex flex-row items-center">
      {title}
      <div class="pl-2"><SmallSpinner /></div>
    </div>
  {:else}
    {isConnected ? 'Disconnect Wallet' : title}
  {/if}
</button>