<script lang="ts">
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import { BarChart3, TrendingUp } from "lucide-svelte";
  import type { Meme } from "$lib/models/Meme";
  import { feedPosts } from "../../../../stores/feedpage.store";
  // import { fetchMemes } from "$lib/ao/relay";
  import Pump from "../../Pump.svelte";
  import Dump from "../../Dump.svelte";
  import Spinner from "../../Spinner.svelte";
  import { fetchMemes } from "$lib/ao/relay";
  import Pump from "../xyz/Pump.svelte";
  import Dump from "../xyz/Dump.svelte";
  import Spinner from "../xyz/Spinner.svelte";

  let memes: Meme[] = [];
  let loading = true;

  feedPosts.subscribe((value) => (memes = value));

  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }

  function truncate(str: string, n: number) {
    return str.length > n ? str.slice(0, n - 1) + "..." : str;
  }

  // onMount(async () => {
  //   await fetchMemes("1", "100");
  //   loading = false;
  // });
</script>

{#if loading}
  <div class="flex justify-center items-center min-h-screen">
    <Spinner />
  </div>
{:else}
  <div class="max-w-6xl mx-auto p-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each memes as meme (meme.Pool)}
        <Link to="/Feed/{meme.Pool}" class="block">
          <Card
            class="bg-white text-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col h-full transition-transform duration-200 hover:scale-105 border border-gray-200"
          >
            <CardHeader
              class="p-3 bg-gradient-to-r from-purple-100 to-indigo-100"
            >
              <div class="flex items-center space-x-3">
                <Avatar class="w-10 h-10">
                  <AvatarImage
                    src={meme.Profile ? toUrl(meme.Profile.Image) : ""}
                    alt={meme.Creator}
                    class="rounded-full border-2 border-purple-300"
                  />
                  <AvatarFallback class="bg-purple-200 text-purple-700"
                    >{meme.Creator.slice(0, 2)}</AvatarFallback
                  >
                </Avatar>
                <div class="overflow-hidden">
                  <CardTitle
                    class="text-sm font-semibold truncate text-purple-700"
                  >
                    {truncate(meme.Creator, 15)}
                  </CardTitle>
                  <p class="text-gray-500 text-xs truncate">
                    @{meme.Profile?.Name || meme.Creator}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent class="p-3 flex-grow overflow-hidden bg-white">
              {#if meme.Post.Kind == "0"}
                <p class="text-sm mb-2 line-clamp-3 text-gray-700">
                  {JSON.parse(meme.Post.Content).content}
                </p>
                <img
                  alt="Meme content"
                  src={toUrl(JSON.parse(meme.Post.Content).media)}
                  class="w-full h-40 object-cover rounded-md shadow-md"
                />
              {:else}
                <p class="text-sm line-clamp-5 text-gray-700">
                  {meme.Post.Content}
                </p>
              {/if}
            </CardContent>

            <CardFooter class="px-3 py-2 bg-gray-100 mt-auto">
              <div
                class="flex justify-between items-center w-full text-xs text-gray-600"
              >
                <div class="flex items-center space-x-1">
                  <BarChart3 class="w-4 h-4 text-indigo-400" />
                  <span
                    >{meme.Analytics.MarketCap
                      ? `$${meme.Analytics.MarketCap}`
                      : "$0"}</span
                  >
                </div>
                <div class="flex items-center space-x-1">
                  <TrendingUp class="w-4 h-4 text-green-400" />
                  <span
                    >{meme.Analytics.Price
                      ? `$${meme.Analytics.Price}`
                      : "$0"}</span
                  >
                </div>
              </div>
            </CardFooter>
            <div class="flex justify-between w-full px-3 py-2 bg-white">
              <Pump {meme} />
              <Dump {meme} />
            </div>
          </Card>
        </Link>
      {/each}
    </div>
  </div>
{/if}

<style>
  :global(body) {
    background-color: #f9fafc;
  }
</style>
