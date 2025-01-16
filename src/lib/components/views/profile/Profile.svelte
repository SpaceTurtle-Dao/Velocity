<script lang="ts">
  import { fly } from "svelte/transition";
  import { Card, CardContent } from "$lib/components/ui/card";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import { currentUser } from "$lib/stores/current-user.store";
  import Post from "../../posts/Post.svelte";
  import Followers from "../../Followers/Followers.svelte";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { Link, CalendarDays } from "lucide-svelte";
  import { onMount } from "svelte";
  import { fetchEvents, fetchFollowList, fetchProfile } from "$lib/ao/relay";
  import UpdateProfile from "./UpdateProfile.svelte";
  import Follow from "../../Follow/Follow.svelte";
  import UserList from "$lib/components/UserList/UserList.svelte";
  import Process from "$lib/ao/process.svelte";
  import { X } from "lucide-svelte";
  import { getDisplayUrl } from "$lib/utils/url.utils";
  import { formatJoinedTimestamp } from "$lib/utils/timestamp.utils";
  import type { Profile } from "$lib/models/Profile";
  import { user } from "$lib/stores/profile.store";
  import { event } from "$lib/ao/relay";

  import { usersProfile } from "$lib/stores/users-profile.store";
  import { followListStore } from "$lib/stores/follow-list.store";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";

  export let params: { address?: string } = {};

  $: profile =
    params?.address === $currentUser.address
      ? $currentUser
      : $usersProfile.get(params?.address ?? "");

  let activeTab: string = "posts";
  let events: Array<Event> = [];

  let showModal = false;
  let textWithUrl = "";
  let pTag: HTMLElement | null;
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  console.log("Will load thissss!!!");

  // user.subscribe(async (value) => {
  //     let filters: Array<any> = [];
  //     if (value) {
  //         let filter = {
  //             kinds: [1],
  //             since: 1663905355000,
  //             until: Date.now(),
  //             limit: 100,
  //         };
  //         filters.push(filter);
  //         userInfo = value;
  //         let _filters = JSON.stringify(filters);
  //         if (userInfo) {
  //             document.getElementById(profile.address);
  //             await fetchEvents(_filters);
  //         }
  //         if (profile.about) {
  //             textWithUrl = profile.about;
  //         }
  //     }
  //     filters = [];
  //     console.log("Will load thissss!!!", filters);
  // });

  async function fetchMedia() {
    let filters: Array<any> = [];
    events = [];
    if (profile) {
      let filter = {
        kinds: ["1", "6"],
        authors: [profile.address],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
      };
      let filter2 = {
        tags: {
          mimeType: [
            "image/apng",
            "image/avif",
            "image/gif",
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/webp",
            "video/x-msvideo",
            "video/mp4",
            "video/mpeg",
            "video/ogg",
            "video/webm",
          ],
        },
      };
      filters.push(filter);
      filters.push(filter2);
      let _filters = JSON.stringify(filters);
      events = await fetchEvents(_filters);
    }
    filters = [];
  }

  async function fetchPost() {
    let filters: Array<any> = [];
    //events = [];
    if (profile) {
      let filter = {
        kinds: ["1", "6"],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
        tags: {
          marker: ["root"],
        },
      };
      let filter2 = {
        tags: {
          From: [profile.address],
        },
      };
      filters.push(filter);
      filters.push(filter2);
      let _filters = JSON.stringify(filters);
      if (profile) {
        events = await fetchEvents(_filters);
      }
    }
    filters = [];
  }

  async function fetchSubs() {
    console.log("will get subs");
    // await subs(userInfo.Process, "1", "100");
  }

  async function fetchSubscriptions() {
    console.log("will get subscriptions");
    // await subscriptions(userInfo.Process, "1", "100");
  }

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
    if (profile) {
      await fetchPost();
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
    }
  });

  const onAddressParamChange = async () => {
    value = "post";
    events = [];
    await fetchPost();
  };

  $: {
    if (params.address) {
      onAddressParamChange();
    }
  }
  let value = "post";

  //////////// Following/ subscribing code
  let numberOfFollowing = 0;

  let followListLoading = true;

  async function getFollowingCount() {
    followListLoading = true;

    if (profile?.address === $currentUser.address) {
      numberOfFollowing = $followListStore.size;
      followListLoading = false;

      followListStore.subscribe((set) => {
        numberOfFollowing = set.size;
      });
    } else {
      if (profile?.address) {
        fetchFollowList(profile?.address)
          .then((followList) => {
            numberOfFollowing = followList.length;
            followListLoading = false;
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }
  }

  $: {
    if (profile) {
      getFollowingCount();
    }
  }
</script>

{#if profile}
  <div class="md:mt-10 max-w-prose">
    <Card
      class="mb-10 overflow-hidden shadow-lg rounded-none md:rounded-lg border-border relative"
    >
      <div class="relative mb-10">
        <!-- Increased bottom margin -->
        <div class="bg-gray-200 relative">
          {#if profile?.banner}
            <img
              src={profile?.banner}
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
              {#if profile?.picture}
                <AvatarImage src={profile?.picture} alt={profile.name} />
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

      <!-- Card Content with Blur Effect -->
      <CardContent>
        <div class="flex justify-between space-x-2">
          <p class="font-bold text-2xl">{profile.name}</p>
          {#if profile.address != $currentUser.address}
            <Follow address={profile.address} />
          {:else}
            <Button
              variant="outline"
              size="sm"
              class="text-primary rounded-full"
              on:click={toggleModal}
            >
              Edit Profile
            </Button>
          {/if}
        </div>
        <p class="text-muted-foreground">
          @{profile.display_name}
        </p>
        {#if profile.about}
          <p class="pt-2.5" id={profile.address}>
            {profile.about}
          </p>
        {/if}
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
              Joined {formatJoinedTimestamp(profile.created_at)}
            </p>
          </div>
        </div>
        <div class="flex space-x-5 pt-2.5">
          <div class="flex space-x-1 items-center">
            {#if followListLoading}
              <Skeleton class="h-5 w-[102px] rounded-full" />
            {:else}
              <div>
                <span class="font-bold mr-1">{numberOfFollowing}</span>

                <span class="font-normal text-muted-foreground"
                  >Subscribing</span
                >
              </div>
            {/if}
          </div>
          <div class="flex space-x-1">
            <!-- <p>{userInfo.Subs}</p> -->
            <p class="text-muted-foreground">Subscribers</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Tabs.Root bind:value class="max-w-prose ">
      <Tabs.List class="grid grid-cols-4">
        <Tabs.Trigger on:click={fetchPost} value="post">Post</Tabs.Trigger>
        <Tabs.Trigger on:click={fetchMedia} value="media">Media</Tabs.Trigger>
        <Tabs.Trigger on:click={fetchSubscriptions} value="subscribed"
          >Subscribed</Tabs.Trigger
        >
        <Tabs.Trigger on:click={fetchSubs} value="subscribers"
          >Subscribers</Tabs.Trigger
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
      <Tabs.Content value="subscribed">
        <UserList />
      </Tabs.Content>
      <Tabs.Content value="subsribers">
        <!-- {#if $user && profile}
                    <UserList />
                {/if} -->
      </Tabs.Content>
    </Tabs.Root>
  </div>
{/if}
<!-- Modal for UpdateProfile -->
{#if showModal && profile}
  <div
    class="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50"
    on:click={toggleModal}
  >
    <div class="rounded-lg p-6 max-w-2xl w-full" on:click|stopPropagation>
      <div class="flex justify-end">
        <Button
          class="mt-4 rounded text-primary"
          variant="ghost"
          on:click={toggleModal}><X class="w-5 h-5" /></Button
        >
      </div>
      <UpdateProfile initialProfile={profile} on:profileUpdated={toggleModal} />
    </div>
  </div>
{/if}
