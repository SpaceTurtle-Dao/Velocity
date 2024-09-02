<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/ui/card";
  import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/ui/avatar";
  import { Button } from "$lib/components/ui/ui/button";
  import { BarChart3, Rocket, MessageCircle, Share2, TrendingUp } from "lucide-svelte";
  import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
  import type { Post } from '../../stores/feedpage.store';
  import { feedPosts } from '../../stores/feedpage.store';
  import type { Meme } from '$lib/models/Meme';
    import { fetchMemes } from '$lib/ao/mememaker';

  let memes: Meme[];

  feedPosts.subscribe(value => memes = value);

  onMount(async () => {
    await fetchMemes("1","100")
  });
</script>

<div class="max-w-4xl mx-auto p-4">
  <div class="space-y-6">
    {#each memes as meme (meme.Pool)}
      <Card class="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div class="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={`https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/${meme.Profile.Image}?ext=png`} alt={meme.Creator} />
              <AvatarFallback>{meme.Creator}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle class="text-lg font-semibold text-blue-700">{meme.Creator}</CardTitle>
              <CardDescription>@{meme.Profile.Name} · {meme.createdAt}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p class="mb-4">{meme.Post.Content}</p>
          <div class="h-48 w-full">
            <!--<ResponsiveContainer width="100%" height="100%">
              <LineChart data={post.marketCapHistory.map((value, index) => ({ day: 7 - index, value }))}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>-->
          </div>
        </CardContent>
        <CardFooter class="flex justify-between text-sm text-gray-500 bg-blue-50">
          <div class="flex items-center">
            <BarChart3 class="w-4 h-4 mr-1 text-blue-500" />
            <span>${meme.Analytics.MarketCap.toLocaleString()}</span>
          </div>
          <div class="flex items-center">
            <TrendingUp class="w-4 h-4 mr-1 text-green-500" />
            <span>${meme.Analytics.Price}</span>
          </div>
          <div class="flex items-center">
            <MessageCircle class="w-4 h-4 mr-1 text-blue-500" />
           <!-- <span>{post.comments}</span>-->
          </div>
          <div class="flex items-center">
            <Share2 class="w-4 h-4 mr-1 text-indigo-500" />
            <!--<span>{post.shares}</span>-->
          </div>
          <Button size="sm" class="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white transition-all duration-300">
            <Rocket class="w-4 h-4 mr-2" />
            Pump
          </Button>
        </CardFooter>
      </Card>
    {/each}
  </div>
</div>

<style>
  :global(body) {
    background-color: #E3F2FD;
  }
</style>