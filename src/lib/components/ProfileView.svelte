<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "$lib/components/ui/tabs";
  import {
    BarChart3,
    Rocket,
    MessageCircle,
    Share2,
    TrendingUp,
  } from "lucide-svelte";
  import Chart from "chart.js/auto";
  import type { Profile } from "$lib/models/Profile";
  import { currentUser, profileMemes } from "../../stores/profile.store";
  import type { Meme } from "$lib/models/Meme";
  import { fetchProfileMemes, getCurrentProfile } from "$lib/ao/mememaker";
  // @ts-ignore
  import { Quantity, Token } from "ao-tokens";
  import { WAR_TOKEN } from "$lib/constants";
  // @ts-ignore
  import fromExponential from "from-exponential";
    import Pump from "./Pump.svelte";
    import Dump from "./Dump.svelte";
    import Tweet from "./Tweet.svelte";

  let activeTab: string | undefined = "posts";
  let chart;

  let profile: Profile;
  let memes: Meme[];
  const decimals = (value: BigInt) => {
    return Math.pow(10, Number(value));
  };
  currentUser.subscribe((value) => {
    profile = value;
  });

  profileMemes.subscribe((value) => {
    memes = value;
  });

  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }

  onMount(async () => {
    const address = await window.arweaveWallet.getActiveAddress();
    await fetchProfileMemes(address, "1", "100");
    await getCurrentProfile();
    const ctx = document.getElementById("marketCapChart");
    //@ts-ignore
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["7d", "6d", "5d", "4d", "3d", "2d", "1d"],
        datasets: [
          {
            label: "Market Cap",
            data: [120000, 125000, 140000, 135000, 150000, 145000, 156000],
            borderColor: "rgb(147, 51, 234)",
            tension: 0.3,
            fill: true,
            backgroundColor: "rgba(147, 51, 234, 0.2)",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  });
</script>

<div class="max-w-4xl mx-auto p-4">
  <Card
    class="mb-10 overflow-hidden transition-transform transform hover:scale-105 duration-300 shadow-lg rounded-lg"
  >
    <!-- Gradient Header -->
    <div class="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-8">
      <div class="flex items-center space-x-6">
        <!-- Avatar with Border -->
        <Avatar class="h-28 w-28 rounded-full ring-4 ring-white shadow-lg">
          <AvatarImage src={toUrl(profile.Image)} alt={profile.Name} />
          <AvatarFallback>{profile.Name}</AvatarFallback>
        </Avatar>
        <!-- Profile Info -->
        <div>
          <h1 class="text-4xl font-extrabold text-white leading-tight">
            {profile.Name}
          </h1>
          <p class="text-lg text-pink-100">@{profile.Name}</p>
          <!--<p class="mt-4 text-white opacity-90">{profile.bio}</p>-->
        </div>
      </div>
    </div>

    <!-- Card Content with Blur Effect -->
    <CardContent
      class="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg p-6 rounded-b-lg"
    >
      <div class="flex justify-between mt-6 space-x-4">
        <!-- Followers -->
        <div class="text-center">
          <p
            in:fly={{ y: 20, duration: 500 }}
            class="text-3xl font-semibold text-purple-600"
          >
            {"1,000"}
          </p>
          <p class="text-gray-600">Followers</p>
        </div>
        <!-- Following -->
        <div class="text-center">
          <p
            in:fly={{ y: 20, duration: 500, delay: 100 }}
            class="text-3xl font-semibold text-pink-600"
          >
            {"1"}
          </p>
          <p class="text-gray-600">Following</p>
        </div>
        <!-- Market Cap -->
        <div class="text-center">
          <p
            in:fly={{ y: 20, duration: 500, delay: 200 }}
            class="text-3xl font-semibold text-red-600"
          >
            ${"10,000,000"}
          </p>
          <p class="text-gray-600">Total Market Cap</p>
        </div>
      </div>
    </CardContent>
  </Card>

  <Tabs
    value={activeTab}
    onValueChange={(value) => (activeTab = value)}
    class="mb-6"
  >
    <TabsList class="grid w-full grid-cols-2 rounded-lg bg-secondary-100 p-1">
      <TabsTrigger
        value="posts"
        class="rounded-md py-2 data-[state=active]:bg-white data-[state=active]:text-secondary-700 data-[state=active]:shadow-sm transition-all"
        >Posts</TabsTrigger
      >
      <TabsTrigger
        value="marketCap"
        class="rounded-md py-2 data-[state=active]:bg-white data-[state=active]:text-secondary-700 data-[state=active]:shadow-sm transition-all"
        >Market Cap</TabsTrigger
      >
    </TabsList>
    <TabsContent value="posts">
      <div class="space-y-4">
        {#each memes as meme}
          <Tweet {meme}/>
        {/each}
      </div>
    </TabsContent>
    <TabsContent value="marketCap">
      <Card class="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle class="text-xl font-bold text-secondary-700"
            >Market Cap Over Time</CardTitle
          >
        </CardHeader>
        <CardContent>
          <canvas id="marketCapChart"></canvas>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</div>

<style>
  :global(body) {
    background-color: #fce4ec;
  }
</style>
