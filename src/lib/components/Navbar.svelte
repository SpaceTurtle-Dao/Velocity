<script lang="ts">
    import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import { Toaster } from "$lib/components/ui/sonner";
    import WalletConnectButton from "$lib/components/wallet.svelte";

    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }
</script>

<nav
    class="fixed top-0 left-0 right-0 z-50 bg-background-500 backdrop-blur-md shadow-md"
>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
                <span class="ml-2 text-xl text-white nova-mono-regular"
                    >Meme Market</span
                >
            </div>

            <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-2 lg:space-x-4">
                    <p
                        class="text-white px-2 py-2 rounded-md text-xs lg:text-sm font-medium"
                    >
                        Pump a Meme and Dump a Meme
                    </p>
                </div>
            </div>
            <div class="hidden md:block">
                <WalletConnectButton
                    buttonClass="text-secondary-600 border-white bg-white hover:bg-secondary-100 text-xs lg:text-sm font-semibold transition-colors duration-300"
                />
            </div>
            <div class="md:hidden">
                <button on:click={toggleMenu} class="text-white">
                    <svg
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        ></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>

    {#if isMenuOpen}
        <div class="md:hidden">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <p class="text-white px-3 py-2 rounded-md text-sm font-medium">
                    Launch a Token Swap a Token
                </p>
                <div class="mt-4">
                    <WalletConnectButton
                        buttonClass="w-full text-secondary-600 border-white bg-white hover:bg-secondary-100 font-semibold transition-colors duration-300"
                    />
                </div>
            </div>
        </div>
    {/if}
</nav>
