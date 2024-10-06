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
  import Post from "$lib/components/posts/Post.svelte";
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
  import { fetchEvents, subs, subscriptions } from "$lib/ao/relay";
  import UpdateProfile from "./UpdateProfile.svelte";
  import Follow from "./Follow.svelte";
  import UserList from "$lib/components/UserList/UserList.svelte";
  import Process from "$lib/ao/process.svelte";

  let activeTab: string = "posts";
  let userInfo: UserInfo;
  let events: Array<Event> = [];
  
  let showModal = false;
  let textWithUrl = "";
  // Get the <p> tag by ID
  let pTag: HTMLElement | null;
  // Regular expression to find URLs in the string
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  user.subscribe((value) => {
    let filters: Array<any> = [];
    if (value) {
      let filter = {
        kinds: [1],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
      };
      filters.push(filter);
      userInfo = value;
      let _filters = JSON.stringify(filters);
      if (userInfo) {
        document.getElementById(userInfo.Process);
        fetchEvents(userInfo.Process, _filters);
      }
      if (userInfo.Profile.about) {
        textWithUrl = userInfo.Profile.about;
      }
    }
    filters = [];
  });

  async function fetchMedia() {
    let filters: Array<any> = [];
    events = [];
    if (userInfo) {
      let filter = {
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
      };
      filters.push(filter);
      let _filters = JSON.stringify(filters);
      fetchEvents(userInfo.Process, _filters);
    }
    filters = [];
  }

  async function fetchPost() {
    let filters: Array<any> = [];
    //events = [];
    if (userInfo) {
      let filter = {
        kinds: ["1"],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
        tags: []
      };
      filters.push(filter);
      let _filters = JSON.stringify(filters);
      if (userInfo) {
        fetchEvents(userInfo.Process, _filters);
      }
    }
    filters = [];
  }

  async function fetchSubs() {
    console.log("will get subs");
    await subs(userInfo.Process, "1", "100");
  }

  async function fetchSubscriptions() {
    console.log("will get subscriptions");
    await subscriptions(userInfo.Process, "1", "100");
  }

  userEvents.subscribe((value) => {
    events = value;
  });

  function formatDate(dateString: number): string {
    return new Date(dateString).toLocaleDateString();
  }

  function setActiveTab(tab: string) {
    activeTab = tab;
  }

  function toggleModal() {
    showModal = !showModal;
  }

  onMount(async () => {
    // Split the string into parts, keeping the URLs separate
    const parts = textWithUrl.split(urlPattern);

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
  //transition-transform transform hover:scale-105 duration-300
</script>

{#if userInfo}
  <div class="mt-10 max-w-prose">
    <Card
      class="mb-10 overflow-hidden shadow-lg rounded-lg border-border relative"
    >
      <div class="relative mb-10">
        <!-- Increased bottom margin -->
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
          <!-- Changed from translate-y-1/2 to translate-y-1/3 -->
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
          {#if userInfo.Process == $currentUser.Process}
            <Button
              variant="outline"
              size="sm"
              class="text-primary rounded rounded-full"
              on:click={toggleModal}
            >
              Edit Profile
            </Button>
          {:else}
            <Follow relay={userInfo.Process} userRelay={$currentUser.Process} />
          {/if}
        </div>
        <p class="font-light text-gray-400">@{userInfo.Profile.display_name}</p>
        <p class="pt-2.5" id={userInfo.Process}></p>
        <div class="flex flex-row space-x-5 pt-2.5">
          {#if userInfo.Profile.website}
            <div class="flex flex-row space-x-1 justify-end items-center">
              <Link size={16} />
              <a class="text-blue-400" href={userInfo.Profile.website}
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
<!-- Modal for UpdateProfile -->
{#if showModal}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    on:click={toggleModal}
  >
    <div class="rounded-lg p-6 max-w-2xl w-full" on:click|stopPropagation>
      <UpdateProfile />
      <Button class="mt-4 rounded" on:click={toggleModal}>Close</Button>
    </div>
  </div>
{/if}