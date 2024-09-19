<script lang="ts">
  import { onMount, afterUpdate } from "svelte";
  import { fly } from "svelte/transition";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import { BarChart3, MessageCircle, Users, UserPlus } from "lucide-svelte";
  import Chart from "chart.js/auto";
  import type { Event } from "$lib/models/Event";
  import sunny from "../../../../assets/sunny.jpeg";
  import Follow from "./Follow.svelte";
  import type { UserInfo } from "$lib/models/Profile";
  import { currentUser } from "../../../../stores/profile.store";

  let activeTab: string = "posts";
  let chart: Chart | null = null;
  let userInfo: UserInfo;
  let _currentUser: UserInfo;

  currentUser.subscribe((value) => {
    _currentUser = value;
  });
  // Mock profile data (Kind 0)
  const profileEvent: Event = {
    id: "profile_event_id",
    pubkey: "user_public_key",
    created_at: 1631234567,
    kind: 0,
    tags: [[]],
    content: JSON.stringify({
      name: "Nickkz",
      about: "Building on AO",
      picture: sunny,
    }),
  };

  // Mock post data (Kind 1)
  const postEvents: Event[] = [
    {
      id: "post_event_id_1",
      pubkey: "user_public_key",
      created_at: 1631234568,
      kind: 1,
      tags: [[]],
      content:
        "Just created a new cryptocurrency called Bitcoin. What do you think?",
    },
    {
      id: "post_event_id_2",
      pubkey: "user_public_key",
      created_at: 1631234569,
      kind: 1,
      tags: [[]],
      content: "Working on a whitepaper. Exciting times ahead!",
    },
  ];

  // Mock follower data (using tags)
  const followerEvents: Event[] = [
    {
      id: "follower_event_id_1",
      pubkey: "follower_public_key_1",
      created_at: 1631234570,
      kind: 3, // Assuming kind 3 for follows
      tags: [["p", "user_public_key"]],
      content: "",
    },
    {
      id: "follower_event_id_2",
      pubkey: "follower_public_key_2",
      created_at: 1631234571,
      kind: 3,
      tags: [["p", "user_public_key"]],
      content: "",
    },
  ];

  // Mock following data (using tags)
  const followingEvents: Event[] = [
    {
      id: "following_event_id_1",
      pubkey: "user_public_key",
      created_at: 1631234572,
      kind: 3,
      tags: [["p", "following_public_key_1"]],
      content: "",
    },
  ];

  function setActiveTab(tab: string) {
    activeTab = tab;
  }

  function initializeChart() {
    if (activeTab === "marketCap") {
      const ctx = document.getElementById(
        "marketCapChart",
      ) as HTMLCanvasElement;
      if (ctx) {
        if (chart) {
          chart.destroy();
        }
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
      }
    }
  }

  onMount(() => {
    // Logic to fetch data from the backend and populate data to the events array
  });

  afterUpdate(() => {
    initializeChart();
  });

  const profileData = JSON.parse(profileEvent.content);
</script>

<div class="max-w-4xl mx-auto p-4">
  <Card
    class="mb-10 overflow-hidden transition-transform transform hover:scale-105 duration-300 shadow-lg rounded-lg"
  >
    <div class="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-8">
      <div class="flex items-center space-x-6">
        <Avatar class="h-28 w-28 rounded-full ring-4 ring-white shadow-lg">
          <AvatarImage src={profileData.picture} alt={profileData.name} />
          <AvatarFallback>{profileData.name}</AvatarFallback>
        </Avatar>
        <div>
          <h1 class="text-4xl font-extrabold text-white leading-tight">
            {profileData.name}
          </h1>
          <p class="text-lg text-pink-100">
            @{profileData.name.toLowerCase().replace(/\s/g, "")}
          </p>
        </div>
        <div>
          <Follow
            relay={userInfo.Profile.pubkey}
            userRelay={_currentUser.Profile.pubkey}
            token={userInfo.Token}
            quantity={userInfo.SubscriptionCost.toString()}
          />
        </div>
      </div>
    </div>

    <CardContent
      class="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg p-6 rounded-b-lg"
    >
      <p class="text-gray-700 mb-4">{profileData.about}</p>
      <div class="flex justify-between mt-6 space-x-4">
        <div class="text-center">
          <p
            in:fly={{ y: 20, duration: 500 }}
            class="text-3xl font-semibold text-purple-600"
          >
            {followerEvents.length}
          </p>
          <p class="text-gray-600">Followers</p>
        </div>
        <div class="text-center">
          <p
            in:fly={{ y: 20, duration: 500, delay: 100 }}
            class="text-3xl font-semibold text-pink-600"
          >
            {followingEvents.length}
          </p>
          <p class="text-gray-600">Following</p>
        </div>
        <div class="text-center">
          <p
            in:fly={{ y: 20, duration: 500, delay: 200 }}
            class="text-3xl font-semibold text-red-600"
          >
            $10,000,000
          </p>
          <p class="text-gray-600">Total Market Cap</p>
        </div>
      </div>
    </CardContent>
  </Card>

  <div class="grid grid-cols-4 gap-4 mb-6">
    {#each [{ name: "posts", icon: MessageCircle, label: "Posts" }, { name: "followers", icon: Users, label: "Followers" }, { name: "following", icon: UserPlus, label: "Following" }, { name: "marketCap", icon: BarChart3, label: "Market Cap" }] as tab}
      <Button
        class="relative overflow-hidden transition-all duration-300 {activeTab ===
        tab.name
          ? 'bg-purple-600 text-white'
          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}"
        on:click={() => setActiveTab(tab.name)}
      >
        <div class="flex items-center justify-center">
          <svelte:component this={tab.icon} class="mr-2 h-4 w-4" />
          {tab.label}
        </div>
        {#if activeTab === tab.name}
          <div class="absolute bottom-0 left-0 w-full h-1 bg-pink-500"></div>
        {/if}
      </Button>
    {/each}
  </div>

  {#if activeTab === "posts"}
    <div class="space-y-4">
      {#each postEvents as post}
        <Card>
          <CardContent
            class="p-6 bg-gray-800 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <p class="text-lg font-medium mb-2">{post.content}</p>
            <p class="text-sm text-gray-400">
              {new Date(post.created_at * 1000).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else if activeTab === "followers"}
    <div class="space-y-4">
      {#each followerEvents as follower}
        <Card>
          <CardContent
            class="p-6 bg-gray-800 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <p class="text-lg font-medium mb-2">Follower: {follower.pubkey}</p>
            <p class="text-sm text-gray-400">
              Followed on: {new Date(
                follower.created_at * 1000,
              ).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else if activeTab === "following"}
    <div class="space-y-4">
      {#each followingEvents as following}
        <Card>
          <CardContent
            class="p-6 bg-gray-800 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <p class="text-lg font-medium mb-2">
              Following: {following.tags[0][1]}
            </p>
            <p class="text-sm text-gray-400">
              Followed on: {new Date(
                following.created_at * 1000,
              ).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else if activeTab === "marketCap"}
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
  {/if}
</div>
