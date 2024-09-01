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
  } from "$lib/components/ui/ui/card";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/ui/avatar";
  import { Button } from "$lib/components/ui/ui/button";
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "$lib/components/ui/ui/tabs";
  import {
    BarChart3,
    Rocket,
    MessageCircle,
    Share2,
    TrendingUp,
  } from "lucide-svelte";
  import Chart from "chart.js/auto";

  let activeTab: string | undefined = "posts";
  let chart;

  const mockUserData = {
    username: "Nickzz_AO",
    displayName: "Nickkzz",
    avatar: "/Users/nickk/Documents/Meme_Market_Frontend/src/assets/sunny.jpeg",
    bio: "Exploring the intersection of social media and crypto. Building the future of decentralized communication.",
    followers: 5280,
    following: 420,
    totalMarketCap: 156000,
  };

  const mockPosts = [
    {
      id: 1,
      content:
        "Just launched our new bonding curve algorithm! 🚀 The future of social media is here. #CryptoTwitter #Web3",
      timestamp: "2h ago",
      marketCap: 2500,
      tokenPrice: 0.05,
      comments: 42,
      shares: 18,
    },
    {
      id: 2,
      content:
        "Thoughts on using market cap for content recommendation? Let's discuss the pros and cons. 🤔 #ContentDiscovery",
      timestamp: "5h ago",
      marketCap: 1800,
      tokenPrice: 0.03,
      comments: 37,
      shares: 12,
    },
    {
      id: 3,
      content:
        "New blog post: 'The Attention Economy and Token-Powered Social Media' - check it out! 📝 #AttentionEconomy #Tokenomics",
      timestamp: "1d ago",
      marketCap: 3200,
      tokenPrice: 0.07,
      comments: 56,
      shares: 29,
    },
  ];

  onMount(() => {
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
    class="mb-8 overflow-hidden transition-all duration-300 hover:shadow-xl"
  >
    <div class="bg-gradient-to-r from-secondary-500 to-pink-500 p-6">
      <div class="flex items-center space-x-4">
        <Avatar class="h-24 w-24 ring-4 ring-white">
          <AvatarImage
            src={mockUserData.avatar}
            alt={mockUserData.displayName}
          />
          <AvatarFallback>{mockUserData.displayName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 class="text-3xl font-extrabold text-white">
            {mockUserData.displayName}
          </h1>
          <p class="text-secondary-200">@{mockUserData.username}</p>
          <p class="mt-2 text-white">{mockUserData.bio}</p>
        </div>
      </div>
    </div>
    <CardContent
      class="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg"
    >
      <div class="flex justify-between mt-6">
        <div class="text-center">
          <p
            in:fly={{ y: 20, duration: 500 }}
            class="text-2xl font-semibold text-secondary-600"
          >
            {mockUserData.followers.toLocaleString()}
          </p>
          <p class="text-gray-500">Followers</p>
        </div>
        <div class="text-center">
          <p
            in:fly={{ y: 20, duration: 500, delay: 100 }}
            class="text-2xl font-semibold text-secondary-600"
          >
            {mockUserData.following.toLocaleString()}
          </p>
          <p class="text-gray-500">Following</p>
        </div>
        <div class="text-center">
          <p
            in:fly={{ y: 20, duration: 500, delay: 200 }}
            class="text-2xl font-semibold text-secondary-600"
          >
            ${mockUserData.totalMarketCap.toLocaleString()}
          </p>
          <p class="text-gray-500">Total Market Cap</p>
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
        {#each mockPosts as post (post.id)}
          <Card
            class="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <CardHeader>
              <CardTitle class="text-lg font-semibold text-secondary-700"
                >{mockUserData.displayName}</CardTitle
              >
              <CardDescription
                >@{mockUserData.username} · {post.timestamp}</CardDescription
              >
            </CardHeader>
            <CardContent>
              <p>{post.content}</p>
            </CardContent>
            <CardFooter
              class="flex justify-between text-sm text-gray-500 bg-secondary-50"
            >
              <div class="flex items-center">
                <BarChart3 class="w-4 h-4 mr-1 text-secondary-500" />
                <span>${post.marketCap.toLocaleString()}</span>
              </div>
              <div class="flex items-center">
                <TrendingUp class="w-4 h-4 mr-1 text-green-500" />
                <span>${post.tokenPrice.toFixed(2)}</span>
              </div>
              <div class="flex items-center">
                <MessageCircle class="w-4 h-4 mr-1 text-blue-500" />
                <span>{post.comments}</span>
              </div>
              <div class="flex items-center">
                <Share2 class="w-4 h-4 mr-1 text-indigo-500" />
                <span>{post.shares}</span>
              </div>
              <Button
                size="sm"
                class="bg-pink-500 text-white"
              >
                <Rocket class="w-4 h-4 mr-2" />
                Pump
              </Button>
            </CardFooter>
          </Card>
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
