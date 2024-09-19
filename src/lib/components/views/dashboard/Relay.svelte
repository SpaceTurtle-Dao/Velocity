<script lang="ts">
    import { relay, spawnRelay } from "$lib/ao/relay";
    import { walletAddress } from '../../../../stores/walletStore';
    import { Zap, Cpu, Copy } from 'lucide-svelte';

    let relayResult: any = null;
    let spawnRelayResult: any = null;
    let isRelayLoading = false;
    let isSpawnRelayLoading = false;
    let copySuccess = false;

    const handleRelay = async () => {
        if ($walletAddress) {
            isRelayLoading = true;
            try {
                relayResult = await relay($walletAddress);
                console.log('Relay result:', relayResult);
            } catch (error) {
                console.error('Relay error:', error);
                relayResult = "Relay failed. Please try again.";
            } finally {
                isRelayLoading = false;
            }
        } else {
            console.error('Wallet not connected');
            relayResult = "Please connect your wallet first.";
        }
    };

    const handleSpawnRelay = async () => {
        isSpawnRelayLoading = true;
        try {
            await spawnRelay();
            spawnRelayResult = "Spawn relay successful";
            console.log('Spawn relay successful');
        } catch (error) {
            console.error('Spawn relay error:', error);
            spawnRelayResult = "Spawn relay failed. Please try again.";
        } finally {
            isSpawnRelayLoading = false;
        }
    };

    const copyAddress = () => {
        if ($walletAddress) {
            navigator.clipboard.writeText($walletAddress);
            copySuccess = true;
            setTimeout(() => copySuccess = false, 2000);
        }
    };
</script>

<div class="flex flex-col space-y-6 p-6 bg-background-700 rounded-lg shadow-lg mt-4">
    <h2 class="text-2xl font-bold text-primary-50 mb-4">Relay Operations</h2>
    
    {#if $walletAddress}
        <div class="bg-background-800 rounded-lg p-4 flex items-center justify-between">
            <div>
                <span class="text-primary-200 text-sm">Your relay ID is</span>
                <p class="text-primary-50 font-mono text-lg break-all">{$walletAddress}</p>
            </div>
            <button
                on:click={copyAddress}
                class="ml-2 p-2 rounded-full bg-background-600 hover:bg-background-500 transition-colors duration-300"
                title="Copy address"
            >
                <Copy class="w-5 h-5 text-primary-50" />
            </button>
        </div>
        {#if copySuccess}
            <div class="text-green-400 text-sm">Address copied to clipboard!</div>
        {/if}
    {:else}
        <div class="bg-background-800 rounded-lg p-4 text-primary-200">
            Please connect your wallet to view your relay ID.
        </div>
    {/if}
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
            on:click={handleRelay}
            class="flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 shadow-md"
            disabled={!$walletAddress || isRelayLoading}
        >
            <Zap class="w-6 h-6 mr-2" />
            {#if isRelayLoading}
                <span class="animate-pulse">Relaying...</span>
            {:else}
                Relay
            {/if}
        </button>

        <button
            on:click={handleSpawnRelay}
            class="flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-full bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 shadow-md"
            disabled={isSpawnRelayLoading}
        >
            <Cpu class="w-6 h-6 mr-2" />
            {#if isSpawnRelayLoading}
                <span class="animate-pulse">Spawning Relay...</span>
            {:else}
                Spawn Relay
            {/if}
        </button>
    </div>

    {#if relayResult !== null || spawnRelayResult !== null}
        <div class="mt-6 p-4 bg-background-800 rounded-lg shadow-inner">
            {#if relayResult !== null}
                <div class="mb-4">
                    <h3 class="text-lg font-bold text-primary-50 mb-2">Relay Result:</h3>
                    <pre class="text-primary-100 bg-background-900 p-3 rounded overflow-x-auto">{JSON.stringify(relayResult, null, 2)}</pre>
                </div>
            {/if}
            {#if spawnRelayResult !== null}
                <div>
                    <h3 class="text-lg font-bold text-primary-50 mb-2">Spawn Relay Result:</h3>
                    <p class="text-primary-100">{spawnRelayResult}</p>
                </div>
            {/if}
        </div>
    {/if}
</div>