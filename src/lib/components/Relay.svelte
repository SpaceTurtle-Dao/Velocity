<script lang="ts">
    import { info, relay, relays, spawnRelay } from "$lib/ao/relay";
    import { userRelay } from "../../stores/profile.store";
    import { walletAddress } from '../../stores/walletStore';
    import { Zap, Cpu, Copy } from 'lucide-svelte';
    import { INDEXER_ID } from "$lib/constants";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";

    let relayResult: string;
    let spawnRelayResult: any = null;
    let isRelayLoading = false;
    let isSpawnRelayLoading = false;
    let copySuccess = false;
    
    userRelay.subscribe((value) => {
        relayResult = value
    })

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
        if (relayResult) {
            navigator.clipboard.writeText(relayResult);
            copySuccess = true;
            setTimeout(() => copySuccess = false, 2000);
        }
    };
</script>

<Card class="mt-4">
    <CardHeader>
        <CardTitle>Relay Operations</CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
        {#if relayResult}
            <div class="bg-background rounded-lg p-4 flex items-center justify-between">
                <div>
                    <span class="text-muted-foreground text-sm">Your relay ID is</span>
                    <p class="text-foreground font-mono text-lg break-all">{relayResult}</p>
                </div>
                <Button variant="ghost" size="icon" on:click={copyAddress} title="Copy address">
                    <Copy class="w-5 h-5" />
                </Button>
            </div>
            {#if copySuccess}
                <div class="text-green-500 text-sm">Address copied to clipboard!</div>
            {/if}
        {:else}
            <div class="bg-background rounded-lg p-4 text-muted-foreground">
                Please connect your wallet to view your relay ID.
            </div>
        {/if}
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
                on:click={handleRelay}
                class="bg-blue-500 hover:bg-blue-600"
                disabled={!$walletAddress || isRelayLoading}
            >
                <Zap class="w-6 h-6 mr-2" />
                {#if isRelayLoading}
                    <span class="animate-pulse">Relaying...</span>
                {:else}
                    Relay
                {/if}
            </Button>

            <Button
                on:click={handleSpawnRelay}
                class="bg-green-500 hover:bg-green-600"
                disabled={isSpawnRelayLoading}
            >
                <Cpu class="w-6 h-6 mr-2" />
                {#if isSpawnRelayLoading}
                    <span class="animate-pulse">Spawning Relay...</span>
                {:else}
                    Spawn Relay
                {/if}
            </Button>
        </div>
    </CardContent>
</Card>