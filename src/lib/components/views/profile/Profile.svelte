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
  import { currentUser, userEvents, user } from "../../../stores/profile.store";
  import type { Event } from "$lib/models/Event";
  import Post from "../../Post.svelte";
  import Followers from "./Followers.svelte";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Separator } from "$lib/components/ui/separator";
  import { Users, LucideUserPlus, Settings } from "lucide-svelte/icons";
  import { onMount } from "svelte";
  import { fetchEvents } from "$lib/ao/relay";
  import UserProfile from "./UpdateProfile.svelte";

  let activeTab: string = "posts";
  let userInfo: UserInfo;
  let userProfile: Profile;
  let events: Array<Event> = [];
  let filters: Array<any> = [];
  let showUserProfile = false;

  user.subscribe((value) => {
    if (value) {
      let filter = {
        kinds: [1],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
      };
      filters.push(filter);
      userInfo = value;
      userProfile = profileFromEvent(userInfo.Profile);
      let _filters = JSON.stringify(filters);
      if (userInfo) {
        console.log("///FETCHING EVENTS///");
        fetchEvents(userInfo.Profile.pubkey, _filters);
      }
    }
    filters = [];
  });

  async function fetchMedia() {
    events = []
    console.log("//////FETHCING MEDIA////////");
    if (userInfo) {
      let filter = {
        kinds: [1],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
        "#imeta": [
          "m image/apng",
          "m image/avif",
          "m image/gif",
          "m image/jpeg",
          "m image/png",
          "m image/svg+xml",
          "m image/webp",
          "m video/x-msvideo",
          "m video/mp4",
          "m video/mpeg",
          "m video/ogg",
          "m video/webm",
        ],
      };
      filters.push(filter);
      let _filters = JSON.stringify(filters);
      if (userInfo) {
        console.log("///FETCHING EVENTS///");
        fetchEvents(userInfo.Profile.pubkey, _filters);
      }
    }
    filters = [];
  }

  async function fetchPost() {
    events = []
    console.log("//////FETHCING MEDIA////////");
    if (userInfo) {
      let filter = {
        kinds: [1],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
      };
      filters.push(filter);
      let _filters = JSON.stringify(filters);
      if (userInfo) {
        console.log("///FETCHING EVENTS///");
        fetchEvents(userInfo.Profile.pubkey, _filters);
      }
    }
    filters = [];
  }

  function toggleUserProfile() {
    showUserProfile = !showUserProfile;
  }

  userEvents.subscribe((value) => {
    if (value.length > 0) {
      console.log("///GOT EVENTS///");
      console.log(events);
      events = value;
    }
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

  onMount(async () => {});
</script>

<div class="mt-12 max-w-4xl mx-auto">
  <Card class="mb-8 overflow-hidden transition-all duration-300 hover:shadow-md rounded-2xl border border-opacity-20">
    <div class="p-8 relative">
      <Button
        class="absolute top-4 right-4 opacity-50 hover:opacity-100"
        variant="ghost"
        on:click={toggleUserProfile}
      >
        <Settings size={20} />
      </Button>
      <div class="flex items-center space-x-6">
        <Avatar class="h-24 w-24 ring-1 ring-opacity-10 shadow-sm">
          {#if userProfile?.picture}
            <AvatarImage src={toUrl(userProfile.picture)} alt={userProfile.name} />
          {/if}
          <AvatarFallback>{userProfile?.name}</AvatarFallback>
        </Avatar>
        <div>
          <h1 class="text-3xl font-bold leading-tight">
            {userProfile?.name}
          </h1>
          <p class="text-md opacity-70">@{userProfile?.name}</p>
        </div>
      </div>
    </div>
  </Card>

  {#if showUserProfile}
    <div transition:fly="{{ y: -50, duration: 300 }}">
      <UserProfile />
    </div>
  {/if}

  <Tabs.Root value="posts" class="w-full">
    <Tabs.List class="grid w-full grid-cols-4 mb-8">
      <Tabs.Trigger value="posts" on:click={fetchPost}>Posts</Tabs.Trigger>
      <Tabs.Trigger value="media" on:click={fetchMedia}>Media</Tabs.Trigger>
      <Tabs.Trigger value="following">Following</Tabs.Trigger>
      <Tabs.Trigger value="followers">Followers</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="posts">
      <div class="space-y-6 mb-5">
        {#each events as event (event.id)}
          <Card class="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <Post {event} />
          </Card>
        {/each}
      </div>
    </Tabs.Content>
    <Tabs.Content value="media">
      <div class="mb-5 space-y-6">
        {#each events as event (event.id)}
          <Card class="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <Post {event} />
          </Card>
        {/each}
      </div>
    </Tabs.Content>
    <Tabs.Content value="following">
      {#if $user && $currentUser}
        <div class="space-y-4">
          <Followers
            relay={$user.Profile.pubkey}
            userRelay={$currentUser.Profile.pubkey}
            token={$user.Token}
            quantity={$user.SubscriptionCost.toString()}
          />
        </div>
      {/if}
    </Tabs.Content>
    <Tabs.Content value="followers">
      {#if $user && $currentUser}
        <div class="space-y-4">
          <Followers
            relay={$user.Profile.pubkey}
            userRelay={$currentUser.Profile.pubkey}
            token={$user.Token}
            quantity={$user.SubscriptionCost.toString()}
          />
        </div>
      {/if}
    </Tabs.Content>
  </Tabs.Root>
</div>