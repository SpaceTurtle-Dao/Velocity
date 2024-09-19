<script lang="ts">
    import { Link } from "svelte-routing";
    import {
        Card,
        CardContent,
        CardFooter,
        CardHeader,
    } from "$lib/components/ui/card";
    import {
        Avatar,
        AvatarFallback,
        AvatarImage,
    } from "$lib/components/ui/avatar";
    import { Button } from "$lib/components/ui/button";
    import {
        MessageCircle,
        Share2,
        TrendingUp,
        DollarSign,
        Users,
        Activity,
        Coins,
    } from "lucide-svelte";

    import Pump from "$lib/components/Pump.svelte";
    import Dump from "$lib/components/Dump.svelte";
    import { DECIMALS } from "$lib/constants";
    // @ts-ignore
    import * as Tabs from "$lib/components/ui/tabs";
    import { Video } from "flowbite-svelte";
  import type { Event }  from "$lib/models/Event";
//   import type { Meme } from "../../stores/feedpage.store";

//   export let meme: Meme;

    

    // export interface Event {
    //     id: string;
    //     pubkey: string;
    //     created_at: number;
    //     kind: number;
    //     tags: string[][];
    //     content: string;
    // }

    export let event: Event;
    let loading = true;

    function getTagValue(tags: string[][], key: string): string | undefined {
        return tags.find(tag => tag[0] === key)?.[1];
    }
  
    function toUrl(tx: string) {
        return `https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/${tx}`;
    }

    function formatTime(timestamp: number): string {
        const now = Date.now();
        const diff = now - timestamp * 1000; // Convert seconds to milliseconds
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days}d`;
        if (hours > 0) return `${hours}h`;
        if (minutes > 0) return `${minutes}m`;
        return "Just now";
    }

    function formatNumber(value: string | number): string {
        if (typeof value === "string") value = parseFloat(value);
        if (isNaN(value)) return "N/A";
        return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }

    const title = getTagValue(event.tags, "title") || "Untitled";
    const thumbnail = getTagValue(event.tags, "thumb");
    const mediaUrl = getTagValue(event.tags, "url");
    const mimeType = getTagValue(event.tags, "m");
    const publishedAt = getTagValue(event.tags, "published_at");
    const marketCap = getTagValue(event.tags, "market_cap") || "0";
    const liquidity = getTagValue(event.tags, "liquidity") || "0";
    const buys = getTagValue(event.tags, "buys") || "0";
    const holders = getTagValue(event.tags, "holders") || "0";
    const replies = getTagValue(event.tags, "replies") || "0";
    const tokenId = getTagValue(event.tags, "token_id");
    const pumps = getTagValue(event.tags, "pumps") || "0";
    const dumps = getTagValue(event.tags, "dumps") || "0";

    // Simulate content loading
    setTimeout(() => {
        loading = false;
    }, 1000);
</script>

<Card
    class="overflow-hidden transition-all duration-300 hover:shadow-lg w-full border-none rounded-s bg-background-600"
>
    <CardHeader class="px-6">
        <div class="flex items-center space-x-4">
            <Avatar
                class="w-12 h-12 rounded-full border-2 border-blue-500 shadow-lg"
            >
                <AvatarFallback class="text-2xl bg-primary text-white">
                    {event.pubkey.slice(0, 2)}
                </AvatarFallback>
            </Avatar>
            <div>
                <h3 class="text-sm font-bold text-white">
                    {event.pubkey.slice(0, 12)}
                </h3>
                <p class="text-sm text-gray-500">
                    @{event.pubkey.slice(0, 12)} · {formatTime(event.created_at)}
                </p>
            </div>
        </div>
    </CardHeader>
    <Link to="/Feed/{event.id}" class="block w-full max-w-3xl mx-auto ml-16">
        <CardContent>
            {#if loading}
                <div class="flex justify-center items-center h-48">
                    <div
                        class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"
                    ></div>
                </div>
            {:else}
                <p class="text-xl mt-3 text-white leading-relaxed">
                    {event.content}
                </p>
                {#if mimeType && mimeType.startsWith("video/")}
                    <Video
                        src={mediaUrl || ''}
                        controls
                        trackSrc={mediaUrl || ''}
                    />
                {:else if thumbnail}
                    <img
                        alt={title}
                        src={thumbnail}
                        class="rounded-lg object-cover w-full shadow-md"
                        style="max-height: 500px; object-fit: cover; width: 100%;"
                    />
                {/if}
            {/if}
        </CardContent>
    </Link>

    <CardFooter
        class="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-background-600 p-6"
    >
        <div class="flex flex-col items-center text-center">
            <DollarSign class="w-6 h-6 text-green-500 mb-1" />
            <span class="font-semibold text-sm text-white">Market Cap</span>
            <span class="text-white">
                {formatNumber(Number(marketCap) / DECIMALS)} wAr
            </span>
        </div>
        <div class="flex flex-col items-center text-center">
            <TrendingUp class="w-6 h-6 text-blue-500 mb-1" />
            <span class="font-semibold text-sm text-white">Liquidity</span>
            <span class="text-white">
                {formatNumber(Number(liquidity) / DECIMALS)} wAr
            </span>
        </div>
        <div class="flex flex-col items-center text-center">
            <Activity class="w-6 h-6 text-purple-500 mb-1" />
            <span class="font-semibold text-sm text-white">Buys</span>
            <span class="text-white">{buys}</span>
        </div>
        <div class="flex flex-col items-center text-center">
            <Users class="w-6 h-6 text-orange-500 mb-1" />
            <span class="font-semibold text-sm text-white">Holders</span>
            <span class="text-white">{holders}</span>
        </div>
        <div class="flex flex-col items-center text-center">
            <MessageCircle class="w-6 h-6 text-indigo-500 mb-1" />
            <span class="font-semibold text-sm text-white">Replies</span>
            <span class="text-white">{replies}</span>
        </div>
        <div class="flex flex-col items-center text-center">
            <Coins class="w-6 h-6 text-red-500 mb-1" />
            <span class="font-semibold text-sm text-white">Token</span>
            {#if tokenId}
                <a
                    class="btn text-blue-500 font-semibold hover:underline"
                    target="_blank"
                    href={`https://www.ao.link/#/token/${tokenId}`}>AOLink</a
                >
            {:else}
                <span class="text-white">N/A</span>
            {/if}
        </div>
    </CardFooter>

    <!-- <div class="flex justify-center space-x-4 p-4 bg-background-600">
        <Pump event={event} meme={meme}>
            <Button
                variant="outline"
                class="flex items-center space-x-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-2 px-4 rounded-lg"
            >
                <span>Pump</span>
                <span class="font-bold">{pumps}</span>
            </Button>
        </Pump>
        <Dump event={event}  meme={meme}>
            <Button
                variant="outline"
                class="flex items-center space-x-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg"
            >
                <span>Dump</span>
                <span class="font-bold">{dumps}</span>
            </Button>
        </Dump>
    </div> -->
</Card>