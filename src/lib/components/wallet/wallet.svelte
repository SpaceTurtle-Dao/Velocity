<script>
    import { onMount } from "svelte";
    import {
        walletAddress,
        setWalletAddress,
        clearWalletAddress,
    } from "../../stores/walletStore";
    import SmallSpinner from "$lib/components/spinners/smallSpinner.svelte";
    import { relay, info, relays } from "$lib/ao/relay";
    import { currentUser, isConnected, user, userRelay } from "$lib/stores/profile.store";
    import { Button } from "$lib/components/ui/button";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    export let buttonClass = "";



    let title = "Connect Wallet";
    let isLoading = false;

    $: if ($walletAddress) {
        title = formatAddress($walletAddress);
        isConnected.set(true)
    } else {
        title = "Connect Wallet";
        isConnected.set(false)
    }
    async function checkWalletConnection() {
        if (window.arweaveWallet) {
            try {
                const address = await window.arweaveWallet.getActiveAddress();
                isConnected.set(true)
                let _relay = await relay(address);
                if (_relay) {
                    userRelay.set(_relay);
                    let _currentUser = await info(_relay)
                    console.log("///////CURRENT USER/////////")
                    console.log(_currentUser)
                    currentUser.set(_currentUser)
                    user.set(_currentUser)
                }
                setWalletAddress(address);
                title = "Disconnect";
                dispatch('connectionSuccess');
                return true;
            } catch (error) {
                console.error('Failed to get active address:', error);
                return false;
            }
        }
        return false;

    }

    //@ts-ignore
    function formatAddress(address) {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }

    const connectWallet = async () => {
        if ($isConnected) {
            await disconnectWallet();
            return;
        }

        title = "Connecting";
        isLoading = true;
        try {
            await window.arweaveWallet.connect(
                [
                    "ACCESS_ADDRESS",
                    "ACCESS_PUBLIC_KEY",
                    "ACCESS_ALL_ADDRESSES",
                    "SIGN_TRANSACTION",
                    "ENCRYPT",
                    "DECRYPT",
                    "SIGNATURE",
                    "ACCESS_ARWEAVE_CONFIG",
                    "DISPATCH",
                ],
                {
                    name: "Super Cool App",
                    logo: "https://arweave.net/jAvd7Z1CBd8gVF2D6ESj7SMCCUYxDX_z3vpp5aHdaYk",
                },
                {
                    host: "g8way.io",
                    port: 443,
                    protocol: "https",
                },
            );
            console.log("Wallet connected successfully");
            const connected = await checkWalletConnection();
            if (connected) {
                // Store connection state in sessionStorage
                sessionStorage.setItem('walletConnected', 'true');
            }
        } catch (error) {
            console.error("Failed to connect wallet:", error);
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
            console.log("Wallet disconnected successfully");
            clearWalletAddress();
        } catch (error) {
            console.error("Failed to disconnect wallet:", error);
        } finally {
            isLoading = false;
        }
    };
</script>

<Button
    class="items-center text-black w-3/4 text-secondary"
    on:click={connectWallet}
>
    {#if isLoading}
        <div class="flex flex-row items-center">
            {title}
            <div class="pl-2"><SmallSpinner /></div>
        </div>
    {:else}
        {$isConnected ? "Disconnect Wallet" : title}
    {/if}
</Button>
