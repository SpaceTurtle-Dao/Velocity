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
  import type { Meme } from "$lib/models/Meme";
  import { DECIMALS } from "$lib/constants";
  // @ts-ignore
  import * as Tabs from "$lib/components/ui/tabs";
  import { Video } from "flowbite-svelte";
  import { onMount } from 'svelte';

  export let meme: Meme;
  let loading = true;
  let imageAspectRatio = 16 / 9; // Default aspect ratio
  let imageWidth = 0;
  let imageHeight = 0;

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
    return "Just now";
  }

  function formatNumber(value: string | number): string {
    if (typeof value === "string") value = parseFloat(value);
    if (isNaN(value)) return "N/A";
    return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }

  onMount(() => {
    if (meme.Post.Kind === "0") {
      const img = new Image();
      img.onload = () => {
        imageWidth = img.width;
        imageHeight = img.height;
        imageAspectRatio = img.width / img.height;
        loading = false;
      };
      img.src = toUrl(JSON.parse(meme.Post.Content).media);
    } else {
      loading = false;
    }
  });

  // Simulate content loading
  setTimeout(() => {
    if (loading) loading = false;
  }, 1000); // Fallback in case image load fails

  $: isSmallImage = imageWidth < 300 || imageHeight < 300;
</script>

<Card
  class="overflow-hidden transition-all duration-300 hover:shadow-xl w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700"
>
  <Link to="/Feed/{meme.Pool}" class="block w-full max-w-3xl mx-auto">
    <CardHeader class="p-6 bg-transparent">
      <div class="flex items-center space-x-4">
        <Avatar
          class="w-20 h-20 rounded-full border-4 border-gray-600 shadow-lg"
        >
          {#if meme.Profile}
            <AvatarImage src={toUrl(meme.Profile.Image)} alt={meme.Creator} />
          {/if}
          <AvatarFallback class="text-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            {meme.Profile
              ? meme.Profile.Name.slice(0, 2)
              : meme.Creator.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 class="text-2xl font-bold text-white">
            {meme.Profile ? meme.Profile.Name : meme.Creator}
          </h3>
          <p class="text-sm text-gray-400">
            @{meme.Creator.slice(0, 12)} · {formatTime(meme.createdAt)}
          </p>
          {#if meme.Profile}
            <p class="text-xs text-gray-500">
              Joined {formatTime(meme.Profile.CreatedAt)}
            </p>
          {/if}
        </div>
      </div>
    </CardHeader>
    <CardContent class="p-6">
      {#if loading}
        <div class="flex justify-center items-center h-48">
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"
          ></div>
        </div>
      {:else}
        <h2 class="text-3xl font-bold mb-4 text-purple-300 leading-tight">
          {meme.Post.Kind === "0"
            ? JSON.parse(meme.Post.Content).content
            : meme.Post.Content}
        </h2>
        {#if meme.Post.Kind === "0"}
          {#if JSON.parse(meme.Post.Content).ext === "mp4" || JSON.parse(meme.Post.Content).ext === "mov" || JSON.parse(meme.Post.Content).ext === "avi"}
            <div class="rounded-2xl overflow-hidden shadow-2xl aspect-video">
              <Video
                src={toUrl(JSON.parse(meme.Post.Content).media)}
                controls
                class="w-full h-full object-cover"
                trackSrc={toUrl(JSON.parse(meme.Post.Content).media)}
              />
            </div>
          {:else}
            <div 
              class="rounded-2xl overflow-hidden shadow-2xl mx-auto"
              class:max-w-md={isSmallImage}
              style="aspect-ratio: {imageAspectRatio}; max-height: 500px;"
            >
              <!-- svelte-ignore a11y-img-redundant-alt -->
              <img
                alt="Meme Image"
                src={toUrl(JSON.parse(meme.Post.Content).media)}
                class="w-full h-full object-contain transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          {/if}
        {/if}
      {/if}
    </CardContent>
  </Link>
  <CardFooter
    class="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-gray-800 bg-opacity-50 p-6 rounded-b-3xl"
  >
    <div class="flex flex-col items-center text-center group">
      <DollarSign class="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-200" />
      <span class="font-semibold text-sm text-gray-400 mt-2">Market Cap</span>
      <span class="text-white font-bold">
        {formatNumber(Number(meme.Analytics.MarketCap / DECIMALS))} wAr
      </span>
    </div>
    <div class="flex flex-col items-center text-center group">
      <TrendingUp class="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-200" />
      <span class="font-semibold text-sm text-gray-400 mt-2">Liquidity</span>
      <span class="text-white font-bold">
        {formatNumber(Number(meme.Analytics.Liquidty) / DECIMALS)} wAr
      </span>
    </div>
    <div class="flex flex-col items-center text-center group">
      <Activity class="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-200" />
      <span class="font-semibold text-sm text-gray-400 mt-2">Buys</span>
      <span class="text-white font-bold">{meme.Analytics.Buys}</span>
    </div>
    <div class="flex flex-col items-center text-center group">
      <Users class="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-200" />
      <span class="font-semibold text-sm text-gray-400 mt-2">Holders</span>
      <span class="text-white font-bold">{meme.Holders.count}</span>
    </div>
    <div class="flex flex-col items-center text-center group">
      <MessageCircle class="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-200" />
      <span class="font-semibold text-sm text-gray-400 mt-2">Replies</span>
      <span class="text-white font-bold">{meme.Replies}</span>
    </div>
    <div class="flex flex-col items-center text-center group">
      <Coins class="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-200" />
      <span class="font-semibold text-sm text-gray-400 mt-2">Token</span>
      <a
        class="text-purple-400 hover:text-purple-300 font-bold transition-colors duration-200"
        target="_blank"
        href={`https://www.ao.link/#/token/${meme.TokenA}`}>AOLink</a
      >
    </div>
  </CardFooter>
  <div class="flex justify-center space-x-6 p-6 bg-gray-900 bg-opacity-50 rounded-b-3xl">
    <Pump {meme}>
      <Button
        variant="outline"
        class="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200"
      >
        <span>Pump</span>
        <span class="font-bold">{meme.Pumps}</span>
      </Button>
    </Pump>
    <Dump {meme}>
      <Button
        class="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200"
      >
        <span>Dump</span>
        <span class="font-bold">{meme.Dumps}</span>
      </Button>
    </Dump>
  </div>
</Card>