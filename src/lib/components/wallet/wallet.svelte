<script lang="ts">
    import {
        walletAddress,
        aoWalletState,
        othuntWalletState,
    } from "../../stores/walletStore";
    import SmallSpinner from "$lib/components/spinners/smallSpinner.svelte";
    import MyWallet from "./my_wallet.svelte";
    // @ts-ignore
    import { relay, info, relays } from "$lib/ao/relay";
    import {
        currentUser,
        isConnected,
        user,
        userRelay,
    } from "$lib/stores/profile.store";
    import { Button } from "$lib/components/ui/button";
    import { Othent } from "@othent/kms";
    import { appConfig, appInfo } from "$lib/models/wallet";
    export let buttonClass = "";

    let title = "Connect Wallet";
    let isLoading = false;

    let aoState = "disconnected";
    let othentState = "disconnected";

    aoWalletState.subscribe((value) => {
        aoState = value;
    });

    othuntWalletState.subscribe((value) => {
        othentState = value;
    });

    $: if ($walletAddress) {
        title = formatAddress($walletAddress);
        isConnected.set(true);
    } else {
        title = "Connect Wallet";
        isConnected.set(false);
    }

    async function checkWalletConnection(): Promise<void> {
        // @ts-ignore
        if (window.arweaveWallet) {
            try {
                // @ts-ignore
                const address = await window.arweaveWallet.getActiveAddress();
                isConnected.set(true);
                let _relay = await relay(address);
                if (_relay) {
                    userRelay.set(_relay);
                    let _currentUser = await info(_relay);
                    currentUser.set(_currentUser);
                    user.set(_currentUser);
                }
                // setWalletAddress(address);
                title = "Disconnect";
            } catch (error) {
                console.error("Failed to get active address:", error);
            }
        }
    }

    function formatAddress(address: string): string {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }

    const connectWallet = async (): Promise<void> => {
        if ($isConnected) {
            await disconnectWallet();
            return;
        }

        title = "Connecting";
        isLoading = true;
        try {
            // @ts-ignore
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
            await checkWalletConnection();
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            title = "Connect Wallet";
        } finally {
            isLoading = false;
        }
    };
    const connectOthent = async (): Promise<void> => {
        try {
            title = "Connecting";
            isLoading = true;
            const othent = new Othent({
                appInfo: appInfo,
            });
            let res = await othent.connect();
            console.log(res);
            if (res) {
                title = "Connected";
                isLoading = false;
                let addr = await othent.getActiveAddress();
                isConnected.set(true);
                let _relay = await relay(addr);
                if (_relay) {
                    userRelay.set(_relay);
                    let _currentUser = await info(_relay);
                    currentUser.set(_currentUser);
                    user.set(_currentUser);
                }
            } else {
                title = "Error";
                isLoading = false;
                isConnected.set(false);
            }
        } catch (error) {
            console.log(error);
            title = "Error";
            isLoading = false;
            isConnected.set(false);
        }
    };

    const disconnectWallet = async (): Promise<void> => {
        title = "Disconnecting";
        isLoading = true;
        try {
            // @ts-ignore
            await window.arweaveWallet.disconnect();
            // clearWalletAddress();
        } catch (error) {
            console.error("Failed to disconnect wallet:", error);
        } finally {
            isLoading = false;
        }
    };
</script>

<div class="flex flex-col gap-4 w-full max-w-[1200px] mx-auto">
    <div
        class="flex-col justify-evenly sm:justify-evenly px-4 sm:px-6 md:px-8 space-y-4"
    >
        <Button
            class="w-full sm:w-auto min-w-[300px] items-center text-black text-secondary {buttonClass}"
            on:click={connectOthent}
        >
            {#if othentState === "connecting"}
                <div class="flex flex-row items-center justify-center">
                    {title}
                    <div class="pl-2"><SmallSpinner /></div>
                </div>
            {:else}
                {$isConnected ? "Disconnect Wallet" : "Othunt"}
            {/if}
        </Button>

        <Button
            class="w-full sm:w-auto min-w-[300px] items-center text-black text-secondary {buttonClass}"
            on:click={connectWallet}
        >
            {#if aoState === "connecting"}
                <div class="flex flex-row items-center justify-center">
                    {title}
                    <div class="pl-2"><SmallSpinner /></div>
                </div>
            {:else}
                {$isConnected ? "Disconnect Wallet" : title}
            {/if}
        </Button>
    </div>

    {#if $isConnected}
        <MyWallet />
    {/if}
</div>
