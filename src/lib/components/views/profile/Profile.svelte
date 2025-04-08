<script lang="ts">
  import { Card, CardContent } from "$lib/components/ui/card";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import { addressStore } from "$lib/stores/address.store";
  import PostComponent from "../../posts/Post.svelte";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { Link, CalendarDays } from "lucide-svelte";
  import { onMount } from "svelte";
  import UpdateProfile from "./UpdateProfile.svelte";
  import Follow from "../../Follow/Follow.svelte";
  import Users from "$lib/components/UserList/Users.svelte";
  import { X } from "lucide-svelte";
  import { getDisplayUrl } from "$lib/utils/url.utils";
  import { formatJoinedTimestamp } from "$lib/utils/timestamp.utils";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import type { Profile } from "$lib/models/Profile";
  import { profileService } from "$lib/services/ProfileService";
  import { hubService } from "$lib/services/HubService";
  import type { Post } from "$lib/models/Post";
  import { registryService } from "$lib/services/RegistryService";
  import type { Hub } from "$lib/models/Hub";

  export let params: { address?: string } = {};

  let profile: Profile;
  let posts: Array<Post> = [];
  let media: Array<Post> = [];
  let hubId: string;
  let hub: Hub;

  let mimeTypes: string[] = [
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
  ];

  let showModal = false;

  profileService.subscribe((profiles) => {
    if (params.address && profiles.has(params.address))
      profile = profiles.get(params.address);
  });

  hubService.subscribe((value) => {
    let _posts: Array<Post> = [];
    let temp = value.values().toArray();
    for (var i = 0; i < temp.length; i++) {
      if (temp[i].from == hubId) {
        _posts.push(temp[i]);
      }
    }
    posts = _posts;
    /*posts = _posts.filter((post) => {
      true
    })*/
    media = posts.filter((value) => {
      if (value.mimeType) {
        return mimeTypes.includes(value.mimeType);
      } else {
        return false;
      }
    });
  });

  async function fetchPost() {
    if (!hubId) return;
    try {
      await hubService.fetchPostWithAuthors(hubId, [hubId]);
    } catch (e) {
      console.log(e);
    }
  }

  // Placeholder functions - implement as needed
  async function fetchSubscriptions() {
    console.log("Fetching subscriptions");
    // Implement subscription fetching logic
  }

  async function fetchSubs() {
    console.log("Fetching subs");
    // Implement subs fetching logic
  }

  function toggleModal() {
    showModal = !showModal;
  }

  onMount(async () => {
    await setup();
  });

  const onAddressParamChange = async () => {
    await setup();
  };

  $: {
    if (params.address) {
      onAddressParamChange();
    }
  }

  let value = "post";

  async function setup() {
    if (!params.address) return;
    try {
      profile = await profileService.get(params.address);
      hubId = (await registryService.getZoneById(params.address)).spec
        .processId;
      hub = await hubService.info(hubId);
      console.log(hub)
      if (profile) {
        await fetchPost();
      }
    } catch (error) {
      console.log(params.address);
      console.log("Error setting up profile:", error);
      setup();
    }
  }
</script>

{#if hubId && hub && profile}
  <div class="md:mt-10 max-w-prose">
    <Card
      class="mb-10 overflow-hidden shadow-lg rounded-none md:rounded-lg border-border relative"
    >
      <div class="relative mb-10">
        <div class="bg-gray-200 relative">
          {#if profile?.coverImage}
            <img
              src={`https://www.arweave.net/${profile.coverImage}`}
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
              {#if profile?.profileImage}
                <AvatarImage
                  class="object-cover"
                  src={`https://www.arweave.net/${profile.profileImage}`}
                  alt={profile.displayName}
                />
              {/if}
              <AvatarFallback
                >{profile.displayName
                  ? profile.displayName[0].toUpperCase()
                  : "U"}</AvatarFallback
              >
            </Avatar>
          </div>
        </div>
      </div>

      <CardContent>
        <div class="flex justify-between space-x-2">
          <p class="font-bold text-2xl">{profile.displayName}</p>
          {#if params.address != $addressStore.address}
            <Follow {hubId} />
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
          @{profile.userName}
        </p>
        {#if profile.description}
          <p class="pt-2.5">
            {profile.description}
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
              Joined {formatJoinedTimestamp(profile.dateCreated)}
            </p>
          </div>
        </div>
        <div class="flex space-x-5 pt-2.5">
          <div class="flex space-x-1 items-center">
            {#if !hub}
              <Skeleton class="h-5 w-[102px] rounded-full" />
            {:else}
              <div class="flex flex-row gap-4">
                <div>
                  <span class="font-bold mr-1">{hub.Following.length}</span>
                  <span class="font-normal text-muted-foreground"
                    >Following</span
                  >
                </div>
                <div>
                  <span class="font-bold mr-1">{hub.Followers.length}</span>
                  <span class="font-normal text-muted-foreground"
                    >Followers</span
                  >
                </div>
              </div>
            {/if}
          </div>
        </div>
      </CardContent>
    </Card>

    <Tabs.Root bind:value class="max-w-prose ">
      <Tabs.List class="grid grid-cols-4">
        <Tabs.Trigger on:click={fetchPost} value="post">Post</Tabs.Trigger>
        <Tabs.Trigger on:click={fetchPost} value="media">Assets</Tabs.Trigger>
        <Tabs.Trigger on:click={fetchSubscriptions} value="subscribed"
          >Following</Tabs.Trigger
        >
        <Tabs.Trigger on:click={fetchSubs} value="assets"
          >Followers</Tabs.Trigger
        >
      </Tabs.List>
      <Tabs.Content value="post">
        {#each posts as post}
          <div class="border border-border">
            <PostComponent {post}/>
          </div>
        {/each}
      </Tabs.Content>
      <Tabs.Content value="media">
        {#each media as post}
          <div class="border border-border max-w-prose">
            <PostComponent {post}/>
          </div>
        {/each}
      </Tabs.Content>
      <Tabs.Content value="subscribed">
        <!-- Placeholder for subscribed users list -->
        <Users addresss={[]} />
      </Tabs.Content>
      <Tabs.Content value="assets">
        <!-- Placeholder for assets -->
        <p>No assets available</p>
      </Tabs.Content>
    </Tabs.Root>
  </div>
{/if}

<!-- Modal for UpdateProfile -->
{#if showModal && profile}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50"
    on:click={toggleModal}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="rounded-lg p-6 max-w-2xl w-full" on:click|stopPropagation>
      <div class="flex justify-end">
        <Button
          class="mt-4 rounded text-primary"
          variant="ghost"
          on:click={toggleModal}><X class="w-5 h-5" /></Button
        >
      </div>
      <UpdateProfile
        initialProfile={profile}
        {hubId}
        on:profileUpdated={toggleModal}
      />
    </div>
  </div>
{/if}
