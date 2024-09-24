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
  import {
    Users,
    LucideUserPlus,
    Settings,
    Link,
    CalendarDays,
  } from "lucide-svelte";
  import { onMount } from "svelte";
  import { fetchEvents } from "$lib/ao/relay";
  import UpdateProfile from "./UpdateProfile.svelte";

  let activeTab: string = "posts";
  let userInfo: UserInfo;
  let userProfile: Profile;
  let events: Array<Event> = [];
  let filters: Array<any> = [];
  let showModal = false;
  let offset = 0; // initial offset
  let progress = 0; //
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
    events = [];
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
    events = [];
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

  function toggleModal() {
    showModal = !showModal;
  }

  const textWithUrl = "Founder | https://x.com/allidoizcode";

  // Regular expression to find URLs in the string
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  onMount(async () => {
    // Split the string into parts, keeping the URLs separate
    const parts = textWithUrl.split(urlPattern);

    // Get the <p> tag by ID
    const pTag: HTMLElement | null = document.getElementById("dynamicLink");

    // Loop over the parts and create text or links accordingly
    parts.forEach((part) => {
      if (pTag) {
        if (urlPattern.test(part)) {
          // If the part is a URL, create an <a> tag
          const linkElement = document.createElement("a");
          linkElement.className = "text-blue-400";
          linkElement.href = part; // Set the href attribute
          linkElement.textContent = part; // Set the text content
          linkElement.target = "_blank"; // Open link in new tab
          pTag?.appendChild(linkElement);
        } else {
          // If the part is not a URL, append it as plain text
          pTag!.appendChild(document.createTextNode(part));
        }
      }
    });
  });
</script>

<div class="mt-10 max-w-prose">
  <Card
    class="mb-10 overflow-hidden transition-transform transform hover:scale-105 duration-300 shadow-lg rounded-lg border-border relative"
  >
    {#if userInfo}
      <div class="relative mb-10">
        <!-- Increased bottom margin -->
        <div class="bg-gray-200 relative">
          {#if userProfile.banner}
            <img
              src="https://pbs.twimg.com/profile_banners/935573782286106624/1709528583/1500x500"
              alt="Banner"
              class="w-full h-full object-cover"
            />
          {/if}
          <img
            src="https://pbs.twimg.com/profile_banners/935573782286106624/1709528583/1500x500"
            alt="Banner"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="absolute bottom-0 left-4 transform translate-y-1/3">
          <!-- Changed from translate-y-1/2 to translate-y-1/3 -->
          <div class="relative">
            <Avatar class="w-24 h-24 border-4 border-white">
              <AvatarImage
                src="https://pbs.twimg.com/profile_images/1562634687792791552/-IBdeBJE_400x400.jpg"
                alt={userProfile.name}
              />
              <AvatarFallback
                >{userProfile.name
                  ? userProfile.name[0].toUpperCase()
                  : "U"}</AvatarFallback
              >
            </Avatar>
          </div>
        </div>
      </div>
    {/if}
    <!-- Card Content with Blur Effect -->
    <CardContent>
      <div class="flex justify-between space-x-2">
        <p class="font-bold text-2xl">Jonathan Green</p>
        <Button
          variant="outline"
          size="sm"
          class="text-primary rounded rounded-full"
          on:click={toggleModal}
        >
          Edit Profile
        </Button>
      </div>
      <p class="font-light text-gray-400">@Jonathan Green</p>
      <p class="pt-2.5" id="dynamicLink"></p>
      <div class="flex flex-row space-x-5 pt-2.5">
        <div class="flex flex-row space-x-1 justify-end items-center">
          <Link size={16} />
          <a class="text-blue-400" href="https://www.ao.link"
            >https://www.ao.link</a
          >
        </div>
        <div class="flex flex-row space-x-1 justify-end items-center">
          <CalendarDays size={16} />
          <p>Joined November 2017</p>
        </div>
      </div>
      <div class="flex space-x-5 pt-2.5">
        <div class="flex space-x-1">
          <p>339</p>
          <p class="text-gray-400">Following</p>
        </div>
        <div class="flex space-x-1">
          <p>1,002</p>
          <p class="text-gray-400">Follower</p>
        </div>
      </div>
    </CardContent>
  </Card>

  <Tabs.Root value="post" class="max-w-prose">
    <Tabs.List class="grid grid-cols-4">
      <Tabs.Trigger
        class="underline-tabs-trigger"
        on:click={fetchPost}
        value="post">Post</Tabs.Trigger
      >
      <Tabs.Trigger on:click={fetchMedia} value="media">Media</Tabs.Trigger>
      <Tabs.Trigger value="following">Following</Tabs.Trigger>
      <Tabs.Trigger value="followers">Followers</Tabs.Trigger>
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
        <Followers
          relay={$user.Profile.pubkey}
          userRelay={$currentUser.Profile.pubkey}
          token={$user.Token}
          quantity={$user.SubscriptionCost.toString()}
        />
      {/if}
    </Tabs.Content>
    <Tabs.Content value="followers">
      {#if $user && $currentUser}
        <Followers
          relay={$user.Profile.pubkey}
          userRelay={$currentUser.Profile.pubkey}
          token={$user.Token}
          quantity={$user.SubscriptionCost.toString()}
        />
      {/if}
    </Tabs.Content>
  </Tabs.Root>
</div>

<!-- Modal for UpdateProfile -->
{#if showModal}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    on:click={toggleModal}
  >
    <div class="rounded-lg p-6 max-w-2xl w-full" on:click|stopPropagation>
      <UpdateProfile />
      <Button class="mt-4" on:click={toggleModal}>Close</Button>
    </div>
  </div>
{/if}
