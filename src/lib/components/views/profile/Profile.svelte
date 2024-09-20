<script lang="ts">
  import { fly } from "svelte/transition";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Root,
  } from "$lib/components/ui/card";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import {
    profileFromEvent,
    type Profile,
    type UserInfo,
  } from "$lib/models/Profile";
  import {
    currentUser,
    userEvents,
    user,
  } from "../../../../stores/profile.store";
  import type { Event } from "$lib/models/Event";
  import Post from "../../Post.svelte";
  import Followers from "./Followers.svelte";
  import Following from "./Following.svelte";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Separator } from "$lib/components/ui/separator";
  import {Users, LucideUserPlus} from "lucide-svelte/icons";

  let activeTab: string = "posts";
  let userInfo: UserInfo;
  let userProfile: Profile;
  let events: Array<Event> = [];

  user.subscribe((value) => {
    userInfo = value;
    userProfile = profileFromEvent(userInfo.Profile);
  });

  userEvents.subscribe((value) => {
    events = value;
  });

  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }

  function setActiveTab(tab: string) {
    activeTab = tab;
  }
</script>

<div class="max-w-4xl mx-auto p-4">
  <Card
    class="mb-10 overflow-hidden transition-transform transform hover:scale-105 duration-300 shadow-lg rounded-lg border-border"
  >
    <!-- Gradient Header -->
    <div class="p-8">
      <div class="flex items-center space-x-6">
        <!-- Avatar with Border -->
        <Avatar class="h-28 w-28 rounded-full ring-4 ring-white shadow-lg">
          <AvatarImage
            src={toUrl(userProfile.picture)}
            alt={userProfile.name}
          />
          <AvatarFallback>{userProfile.name}</AvatarFallback>
        </Avatar>
        <!-- Profile Info -->
        <div>
          <h1 class="text-4xl font-extrabold text-white leading-tight">
            {userProfile.name}
          </h1>
          <p class="text-lg text-pink-100">@{userProfile.name}</p>
        </div>
      </div>
    </div>

    <!-- Card Content with Blur Effect -->
    <CardContent class="backdrop-filter backdrop-blur-lg p-6 rounded-b-lg">
      
    </CardContent>
  </Card>
  <div class="flex mt-6 mb-6 space-x-4">
    <Card
      data-x-chunk-name="dashboard-01-chunk-1"
      data-x-chunk-description="A card showing the total subscriptions and the percentage difference from last month."
      class="border-border"
    >
      <CardHeader
        class="flex flex-row items-center justify-between space-y-0 pb-2"
      >
        <CardTitle class="text-sm font-medium">Subscriptions</CardTitle>
        <Users class="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">+2350</div>
        <p class="text-muted-foreground text-xs">+180.1% from last month</p>
      </CardContent>
    </Card>
    <Card
      data-x-chunk-name="dashboard-01-chunk-1"
      data-x-chunk-description="A card showing the total subscriptions and the percentage difference from last month."
      class="border-border"
    >
      <CardHeader
        class="flex flex-row items-center justify-between space-y-0 pb-2"
      >
        <CardTitle class="text-sm font-medium">Subscribers</CardTitle>
        <LucideUserPlus class="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">+2350</div>
        <p class="text-muted-foreground text-xs">+180.1% from last month</p>
      </CardContent>
    </Card>
    
  </div>

  <Tabs.Root value="post" class="w-full">
    <Tabs.List class="grid grid-cols-4">
      <Tabs.Trigger class="underline-tabs-trigger" value="post"
        >Post</Tabs.Trigger
      >
      <Tabs.Trigger value="media">Media</Tabs.Trigger>
      <Tabs.Trigger value="following">Following</Tabs.Trigger>
      <Tabs.Trigger value="followers">Followers</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="post">
      <Card
        class="overflow-hidden transition-all hover:shadow-lg w-full border-border"
      >
        <CardHeader class="px-6">
          <div class="flex flex-col space-y-4">
            {#each events as event}
              <Post {event} />
              {#if event.id != events[events.length - 1].id}
                <Separator class="w-screen self-center " />
              {/if}
            {/each}
          </div>
        </CardHeader>
        <CardFooter></CardFooter>
      </Card>
    </Tabs.Content>
    <Tabs.Content value="media"></Tabs.Content>
    <Tabs.Content value="following">
      <Following />
    </Tabs.Content>
    <Tabs.Content value="followers">
      <Followers
        relay={$user.Profile.pubkey}
        userRelay={$currentUser.Profile.pubkey}
        token={$user.Token}
        quantity={$user.SubscriptionCost.toString()}
      />
    </Tabs.Content>
  </Tabs.Root>
</div>
