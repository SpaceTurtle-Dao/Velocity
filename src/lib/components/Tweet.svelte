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
  <Card class="overflow-hidden transition-all duration-300 hover:shadow-lg w-full bg-white">
    <CardHeader class="p-6 bg-gray-50">
      <div class="flex items-center space-x-4">
        <Avatar class="w-16 h-16 border-2 border-blue-500">
          {#if meme.Profile}
            <AvatarImage
              src={toUrl(meme.Profile.Image)}
              alt={meme.Creator}
            />
          {/if}
          <AvatarFallback class="text-2xl bg-blue-100 text-blue-700">
            {meme.Profile ? meme.Profile.Name.slice(0, 2) : meme.Creator.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 class="text-xl font-bold text-blue-700">{meme.Profile ? meme.Profile.Name : meme.Creator}</h3>
          <p class="text-sm text-gray-500">@{meme.Creator.slice(0, 12)} · {formatTime(meme.createdAt)}</p>
          {#if meme.Profile}
            <p class="text-xs text-gray-400">Joined {formatTime(meme.Profile.CreatedAt)}</p>
          {/if}
        </div>
      </div>
    </CardHeader>
    <CardContent class="p-6">
      <p class="text-lg mb-4 text-gray-800">
        {meme.Post.Kind === "0" ? JSON.parse(meme.Post.Content).content : meme.Post.Content}
      </p>
      {#if meme.Post.Kind === "0"}
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
          alt="Meme Image"
          src={toUrl(JSON.parse(meme.Post.Content).media)}
          class="rounded-lg object-cover w-full shadow-md"
          style="aspect-ratio: 16/9; object-fit: cover;"
        />
      {/if}
    </CardContent>
    <CardFooter class="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50 p-6">
      <div class="flex flex-col items-center">
        <DollarSign class="w-6 h-6 text-green-500 mb-1" />
        <span class="font-semibold text-sm">Market Cap</span>
        <span class="text-gray-600">${formatNumber(meme.Analytics.MarketCap)}</span>
      </div>
      <div class="flex flex-col items-center">
        <TrendingUp class="w-6 h-6 text-blue-500 mb-1" />
        <span class="font-semibold text-sm">Volume</span>
        <span class="text-gray-600">${formatNumber(meme.Analytics.Volume)}</span>
      </div>
      <div class="flex flex-col items-center">
        <Activity class="w-6 h-6 text-purple-500 mb-1" />
        <span class="font-semibold text-sm">Buys</span>
        <span class="text-gray-600">{meme.Analytics.Buys}</span>
      </div>
      <div class="flex flex-col items-center">
        <Users class="w-6 h-6 text-orange-500 mb-1" />
        <span class="font-semibold text-sm">Holders</span>
        <span class="text-gray-600">{meme.Holders.length}</span>
      </div>
      <div class="flex flex-col items-center">
        <MessageCircle class="w-6 h-6 text-indigo-500 mb-1" />
        <span class="font-semibold text-sm">Replies</span>
        <span class="text-gray-600">{meme.Replies}</span>
      </div>
      <div class="flex flex-col items-center">
        <Share2 class="w-6 h-6 text-red-500 mb-1" />
        <span class="font-semibold text-sm">Supply</span>
        <span class="text-gray-600">{formatNumber(meme.Supply)}</span>
      </div>
    </CardFooter>
    <div class="flex justify-center space-x-4 p-4 bg-gray-100">
      <Pump {meme}>
        <Button variant="outline" class="flex items-center space-x-2 bg-green-100 hover:bg-green-200 text-green-700">
          <span>Pump</span>
          <span class="font-bold">{meme.Pumps}</span>
        </Button>
      </Pump>
      <Dump {meme}>
        <Button variant="outline" class="flex items-center space-x-2 bg-red-100 hover:bg-red-200 text-red-700">
          <span>Dump</span>
          <span class="font-bold">{meme.Dumps}</span>
        </Button>
      </Dump>
    </div>
  </Card>
</Link>

<style>
  :global(body) {
    background-color: #e3f2fd;
  }
</style>