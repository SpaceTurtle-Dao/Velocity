<script lang="ts">
  import { Card, CardContent } from "$lib/components/ui/card";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import { type Profile } from "$lib/models/Profile";
  import { currentUser } from "$lib/stores/current-user.store";
  import Post from "$lib/components/posts/Post.svelte";
  import Followers from "$lib/components/Followers/Followers.svelte";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { Link, CalendarDays } from "lucide-svelte";
  import { onMount, afterUpdate } from "svelte";
  import { fetchEvents, fetchProfile } from "$lib/ao/relay";
  import Follow from "$lib/components/Follow/Follow.svelte";
  import Users from "$lib/components/UserList/Users.svelte";

  import { getDisplayUrl } from "$lib/utils/url.utils";
  import { formatJoinedTimestamp } from "$lib/utils/timestamp.utils";
  import { usersProfile } from "$lib/stores/users-profile.store";

  export let params: { address?: string } = {};

  let activeTab: string = "posts";

  $: profile = $usersProfile.get(params?.address ?? "");

  let events: Array<any> = [];
  let textWithUrl = "";
  let pTag: HTMLElement | null;
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  async function fetchMedia() {
    if (!profile) return;
    let filters: Array<any> = [
      {
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
      },
    ];
    let _filters = JSON.stringify(filters);
    events = await fetchEvents(_filters);
  }

  async function fetchPost() {
    if (!profile) return;
    let filters: Array<any> = [
      {
        kinds: ["1"],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
        tags: [],
        authors: [profile.address],
      },
    ];
    let _filters = JSON.stringify(filters);
    events = await fetchEvents(_filters);
    console.log("events for a particular user", events);
  }

  // async function fetchSubs() {
  //     if (!userInfo) return;
  //     await subs(userInfo.Process, "1", "100");
  // }

  // async function fetchSubscriptions() {
  //     if (!userInfo) return;
  //     await subscriptions(userInfo.Process, "1", "100");
  // }

  function formatDate(dateString: number): string {
    return new Date(dateString).toLocaleDateString();
  }

  function setActiveTab(tab: string) {
    activeTab = tab;
  }

  async function processAboutText() {
    if (!profile) return;
    const parts = textWithUrl.split(urlPattern);
    pTag = document.getElementById(profile.address);
    if (pTag) {
      pTag.innerHTML = ""; // Clear existing content
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
    if (profile && profile.about) {
      processAboutText();
    }
  });

  onMount(async () => {
    await fetchPost();
    await fetchMedia();
  });
</script>

{#if profile}
  <div class="md:mt-10 max-w-prose">
    <Card
      class="mb-10 overflow-hidden shadow-lg rounded-none md:rounded-lg border-border relative"
    >
      <div class="relative mb-10">
        <div class="bg-gray-200 relative">
          {#if profile.banner}
            <img
              src={profile.banner}
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
              {#if profile.picture}
                <AvatarImage src={profile.picture} alt={profile.name} />
              {/if}
              <AvatarFallback
                >{profile.name
                  ? profile.name[0].toUpperCase()
                  : "U"}</AvatarFallback
              >
            </Avatar>
          </div>
        </div>
      </div>

      <CardContent>
        <div class="flex justify-between space-x-2">
          <p class="font-bold text-2xl">{profile.name}</p>
          {#if $currentUser && profile.address !== $currentUser.address}
            <!-- <Follow
                            relay={userInfo.Process}
                            userRelay={$currentUser.Process}
                        /> -->
          {/if}
        </div>
        <p class="text-muted-foreground">
          @{profile.display_name}
        </p>

        <p class="pt-2.5" id={profile.address}>
          {#if profile.about}
            {profile.about}
          {/if}
        </p>
        <div class="flex flex-row space-x-5 pt-2.5">
          {#if profile.website}
            <div class="flex flex-row space-x-1 justify-end items-center">
              <Link size={16} />
              <a
                class="text-blue-400"
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer">{getDisplayUrl(profile.website)}</a
              >
            </div>
          {/if}
          <div
            class="flex flex-row space-x-1 justify-end items-center text-muted-foreground"
          >
            <CalendarDays size={16} />
            <p>
              Joined {formatJoinedTimestamp(Number(profile.created_at))}
            </p>
          </div>
        </div>
        <div class="flex space-x-5 pt-2.5">
          <div class="flex space-x-1">
            <!-- <p>{userInfo.Subscriptions}</p> -->
            <p class="text-muted-foreground">Subscribing</p>
          </div>
          <div class="flex space-x-1">
            <!-- <p>{userInfo.Subs}</p> -->
            <p class="text-muted-foreground">Subscribers</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Tabs.Root value="post" class="max-w-prose">
      <Tabs.List class="grid grid-cols-4">
        <Tabs.Trigger value="post">Post</Tabs.Trigger>
        <Tabs.Trigger value="media">Media</Tabs.Trigger>
        <!-- <Tabs.Trigger on:click={fetchSubscriptions} value="following"
          >Subscribing</Tabs.Trigger
        >
        <Tabs.Trigger on:click={fetchSubs} value="followers"
          >Subscribers</Tabs.Trigger
        > -->
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
        <Users />
      </Tabs.Content>
      <Tabs.Content value="followers">
        <Users />
      </Tabs.Content>
    </Tabs.Root>
  </div>
{/if}
