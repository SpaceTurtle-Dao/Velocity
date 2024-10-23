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
  import { currentUser, user } from "../../../stores/profile.store";
  import Post from "$lib/components/posts/Post.svelte";
  import Followers from "$lib/components/Followers/Followers.svelte";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import {
    Users,
    LucideUserPlus,
    Settings,
    Link,
    CalendarDays,
  } from "lucide-svelte";
  import { onMount, afterUpdate } from "svelte";
  import { fetchEvents, info, subs, subscriptions } from "$lib/ao/relay";
  import Follow from "$lib/components/Follow/Follow.svelte";
  import UserList from "$lib/components/UserList/UserList.svelte";
  import Process from "$lib/ao/process.svelte";
//   import { params } from "svelte-spa-router";

  export let params: { process?: string } = {};

  let activeTab: string = "posts";
  let userInfo: UserInfo | null = null;
  let events: Array<any> = [];
  let textWithUrl = "";
  let pTag: HTMLElement | null;
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  $: process = params.process || "";

  async function loadUserData() {
    if (process) {
      userInfo = null; // Reset userInfo to trigger re-render
      events = []; // Reset events
      userInfo = await info(process);
      if (userInfo) {
        await fetchUserData();
        if (userInfo.Profile.about) {
          textWithUrl = userInfo.Profile.about;
          await processAboutText();
        }
      }
    }
  }

  $: if (process) {
    loadUserData();
  }

  async function fetchUserData() {
    if (!userInfo) return;
    let filters: Array<any> = [{
      kinds: [1],
      since: 1663905355000,
      until: Date.now(),
      limit: 100,
    }];
    let _filters = JSON.stringify(filters);
    await fetchEvents(userInfo.Process, _filters);
  }

  async function fetchMedia() {
    if (!userInfo) return;
    let filters: Array<any> = [{
      kinds: ["1"],
      since: 1663905355000,
      until: Date.now(),
      limit: 100,
      tags: {
        imeta: [
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
      },
    }];
    let _filters = JSON.stringify(filters);
    events = await fetchEvents(userInfo.Process, _filters);
  }

  async function fetchPost() {
    if (!userInfo) return;
    let filters: Array<any> = [{
      kinds: ["1"],
      since: 1663905355000,
      until: Date.now(),
      limit: 100,
      tags: []
    }];
    let _filters = JSON.stringify(filters);
    events = await fetchEvents(userInfo.Process, _filters);
  }

  async function fetchSubs() {
    if (!userInfo) return;
    await subs(userInfo.Process, "1", "100");
  }

  async function fetchSubscriptions() {
    if (!userInfo) return;
    await subscriptions(userInfo.Process, "1", "100");
  }

  function formatDate(dateString: number): string {
    return new Date(dateString).toLocaleDateString();
  }

  function setActiveTab(tab: string) {
    activeTab = tab;
  }

  async function processAboutText() {
    if (!userInfo) return;
    const parts = textWithUrl.split(urlPattern);
    pTag = document.getElementById(userInfo.Process);
    if (pTag) {
      pTag.innerHTML = ''; // Clear existing content
      parts.forEach((part) => {
        if (urlPattern.test(part)) {
          const linkElement = document.createElement("a");
          linkElement.className = "text-blue-400";
          linkElement.href = part;
          linkElement.textContent = part;
          linkElement.target = "_blank";
          pTag?.appendChild(linkElement);
        } else {
          pTag!.appendChild(document.createTextNode(part));
        }
      });
    }
  }

  afterUpdate(() => {
    if (userInfo && userInfo.Profile.about) {
      processAboutText();
    }
  });
</script>

{#if userInfo}
  <div class="mt-10 max-w-prose">
    <Card
      class="mb-10 overflow-hidden shadow-lg rounded-lg border-border relative"
    >
      <div class="relative mb-10">
        <div class="bg-gray-200 relative">
          {#if userInfo.Profile.banner}
            <img
              src={userInfo.Profile.banner}
              alt="Banner"
              class="w-full max-h-48 object-cover"
            />
          {:else}
            <div class="w-full h-32 object-cover bg-secondary" />
          {/if}
        </div>
        <div class="absolute bottom-0 left-4 transform translate-y-1/3">
          <div class="relative">
            <Avatar class="w-24 h-24 border-4 border-white">
              {#if userInfo.Profile.picture}
                <AvatarImage
                  src={userInfo.Profile.picture}
                  alt={userInfo.Profile.name}
                />
              {/if}
              <AvatarFallback
                >{userInfo.Profile.name
                  ? userInfo.Profile.name[0].toUpperCase()
                  : "U"}</AvatarFallback
              >
            </Avatar>
          </div>
        </div>
      </div>

      <CardContent>
        <div class="flex justify-between space-x-2">
          <p class="font-bold text-2xl">{userInfo.Profile.name}</p>
          {#if $currentUser && userInfo.Process !== $currentUser.Process}
            <Follow relay={userInfo.Process} userRelay={$currentUser.Process} />
          {/if}
        </div>
        <p class="font-light text-gray-400">@{userInfo.Profile.display_name}</p>
        <p class="pt-2.5" id={userInfo.Process}></p>
        <div class="flex flex-row space-x-5 pt-2.5">
          {#if userInfo.Profile.website}
            <div class="flex flex-row space-x-1 justify-end items-center">
              <Link size={16} />
              <a class="text-blue-400" href={userInfo.Profile.website} target="_blank" rel="noopener noreferrer"
                >{userInfo.Profile.website}</a
              >
            </div>
          {/if}
          <div class="flex flex-row space-x-1 justify-end items-center">
            <CalendarDays size={16} />
            <p>Joined</p>
          </div>
        </div>
        <div class="flex space-x-5 pt-2.5">
          <div class="flex space-x-1">
            <p>{userInfo.Subscriptions}</p>
            <p class="text-gray-400">Following</p>
          </div>
          <div class="flex space-x-1">
            <p>{userInfo.Subs}</p>
            <p class="text-gray-400">Follower</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Tabs.Root value="post" class="max-w-prose">
      <Tabs.List class="grid grid-cols-4">
        <Tabs.Trigger on:click={fetchPost} value="post">Post</Tabs.Trigger>
        <Tabs.Trigger on:click={fetchMedia} value="media">Media</Tabs.Trigger>
        <Tabs.Trigger on:click={fetchSubscriptions} value="following"
          >Following</Tabs.Trigger
        >
        <Tabs.Trigger on:click={fetchSubs} value="followers"
          >Followers</Tabs.Trigger
        >
      </Tabs.List>
      <Tabs.Content value="post">
        <div class="">
          {#each events as event}
            <div class="border border-border max-w-prose">
              <Post {event} />
            </div>
          {/each}
        </div>
      </Tabs.Content>
      <Tabs.Content value="media">
        <div class="">
          {#each events as event}
            <div class="border border-border max-w-prose">
              <Post {event} />
            </div>
          {/each}
        </div>
      </Tabs.Content>
      <Tabs.Content value="following">
        {#if $user && $currentUser}
          <UserList />
        {/if}
      </Tabs.Content>
      <Tabs.Content value="followers">
        {#if $user && $currentUser}
          <UserList />
        {/if}
      </Tabs.Content>
    </Tabs.Root>
  </div>
{/if}