<script lang="ts">
  import { Link } from "svelte-routing";
  import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
  } from "$lib/components/ui/ui/card";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/ui/avatar";
  import { Button } from "$lib/components/ui/ui/button";
  import {
    MessageCircle,
    Share2,
    TrendingUp,
    DollarSign,
    Users,
    Activity,
  } from "lucide-svelte";
  import Pump from "$lib/components/Pump.svelte";
  import Dump from "$lib/components/Dump.svelte";

  export let meme: {
    Pool: string;
    Creator: string;
    Profile?: {
      Name: string;
      Image: string;
      CreatedAt: number;
    };
    Post: {
      Kind: string;
      Content: string;
    };
    createdAt: number;
    Analytics: {
      MarketCap: string;
      Volume: string;
      Buys: number;
      Liquidty: string;
    };
    Pumps: number;
    Dumps: number;
    Replies: number;
    Supply: string;
    Holders: any[];
  };

  function toUrl(tx: string) {
    return `https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/${tx}`;
  }

  function formatTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'Just now';
  }

  function formatNumber(value: string | number): string {
    if (typeof value === 'string') value = parseFloat(value);
    if (isNaN(value)) return 'N/A';
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
</script>

<Link to="/Feed/{meme.Pool}" class="block w-full max-w-3xl mx-auto">
  <Card class="overflow-hidden transition-all duration-300 hover:shadow-lg w-full">
    <CardHeader class="p-6">
      <div class="flex items-center space-x-4">
        {#if meme.Profile}
          <Avatar class="w-16 h-16">
            <AvatarImage
              src={toUrl(meme.Profile.Image)}
              alt={meme.Creator}
            />
            <AvatarFallback class="text-2xl">{meme.Profile.Name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 class="text-xl font-semibold text-blue-700">{meme.Profile.Name}</h3>
            <p class="text-base text-gray-500">@{meme.Creator.slice(0, 12)} · {formatTime(meme.createdAt)}</p>
            <p class="text-sm text-gray-400">Joined {formatTime(meme.Profile.CreatedAt)}</p>
          </div>
        {:else}
          <Avatar class="w-16 h-16">
            <AvatarFallback class="text-2xl">{meme.Creator.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 class="text-xl font-semibold text-blue-700">{meme.Creator}</h3>
            <p class="text-base text-gray-500">@{meme.Creator.slice(0, 12)} · {formatTime(meme.createdAt)}</p>
          </div>
        {/if}
      </div>
    </CardHeader>
    <CardContent class="p-6">
      {#if meme.Post.Kind == "0"}
        <p class="text-lg mb-4">{JSON.parse(meme.Post.Content).content}</p>
        <img
          alt="Meme Image"
          src={toUrl(JSON.parse(meme.Post.Content).media)}
          class="rounded-md object-cover w-full mt-2"
          style="aspect-ratio: 16/9; object-fit: cover;"
        />
      {:else}
        <p class="text-lg">{meme.Post.Content}</p>
      {/if}
    </CardContent>
    <CardFooter class="flex flex-wrap justify-between text-base text-gray-500 bg-blue-50 p-6">
      <div class="flex items-center mr-4 mb-2">
        <DollarSign class="w-6 h-6 mr-2 text-blue-500" />
        <span class="font-semibold">Market Cap: ${formatNumber(meme.Analytics.MarketCap)}</span>
      </div>
      <div class="flex items-center mr-4 mb-2">
        <TrendingUp class="w-6 h-6 mr-2 text-green-500" />
        <span class="font-semibold">Volume: ${formatNumber(meme.Analytics.Volume)}</span>
      </div>
      <div class="flex items-center mr-4 mb-2">
        <Activity class="w-6 h-6 mr-2 text-purple-500" />
        <span class="font-semibold">Buys: {meme.Analytics.Buys}</span>
      </div>
      <div class="flex items-center mr-4 mb-2">
        <Users class="w-6 h-6 mr-2 text-orange-500" />
        <span class="font-semibold">Holders: {meme.Holders.length}</span>
      </div>
      <div class="flex items-center mr-4 mb-2">
        <MessageCircle class="w-6 h-6 mr-2 text-blue-500" />
        <span class="font-semibold">Replies: {meme.Replies}</span>
      </div>
      <div class="flex items-center mr-4 mb-2">
        <Share2 class="w-6 h-6 mr-2 text-indigo-500" />
        <span class="font-semibold">Supply: {formatNumber(meme.Supply)}</span>
      </div>
      <div class="flex items-center space-x-4">
        <Pump {meme}>
          <span slot="counter" class="ml-2 font-semibold">{meme.Pumps}</span>
        </Pump>
        <Dump {meme}>
          <span slot="counter" class="ml-2 font-semibold">{meme.Dumps}</span>
        </Dump>
      </div>
    </CardFooter>
  </Card>
</Link>

<style>
  :global(body) {
    background-color: #e3f2fd;
  }
</style>