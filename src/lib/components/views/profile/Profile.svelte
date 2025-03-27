<script lang="ts">
  import { Card, CardContent } from "$lib/components/ui/card";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import { currentUser } from "$lib/stores/current-user.store";
  import PostComponent from "../../posts/Post.svelte";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { Link, CalendarDays } from "lucide-svelte";
  import { onMount } from "svelte";
  import { fetchEvents, fetchFollowList, fetchProfile } from "$lib/ao/relay";
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
  import { addressStore } from "$lib/stores/address.store";

  export let params: { address?: string } = {};

  let profile: Profile;

  let activeTab: string = "posts";
  let posts: Array<Post> = [];
  let media: Array<Post> = [];

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
  let textWithUrl = "";
  var pTag: HTMLElement | null;
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  async function fetchPost() {
    posts = [];
    if (!params.address) return;
    posts = await hubService.fetchPostWithAuthors([params.address]);
    media = posts.filter((value) => {
      if (value.mimeType) {
        return mimeTypes.includes(value.mimeType);
      } else {
        return false;
      }
    });
  }

  async function fetchSubs() {
    console.log("will get subs");
    // await subs(userInfo.Process, "1", "100");
  }

  async function fetchSubscriptions() {
    console.log("will get subs");
    console.log(profile.followList);
    //profile.followList = fetchFollowList(profile!.address)
    // await subs(userInfo.Process, "1", "100");
  }

  function toggleModal() {
    showModal = !showModal;
  }

  onMount(async () => {
    setup();
  });

  const onAddressParamChange = async () => {
    console.log("got new params!!!!!!");
    console.log(params.address);
    setup();
    /*value = "post";
    events = [];
    await fetchPost();*/
  };

  $: {
    if (params.address) {
      onAddressParamChange();
    }
  }
  let value = "post";

  let followListLoading = false;

  async function setup() {
    if (!params.address) return;
    profile = await profileService.get(params.address);
    if (profile) {
      console.log("getting post");
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
            pTag.appendChild(linkElement);
          } else {
            // If the part is not a URL, append it as plain text
            pTag!.appendChild(document.createTextNode(part));
          }
        }
      });
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
          {#if profile.address != $addressStore.address}
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
                <span class="font-bold mr-1">{profile.followList.length}</span>

                <span class="font-normal text-muted-foreground"
                  >Subscribing</span
                >
              </div>
            {/if}
          </div>
          <div class="flex space-x-1">
            <!-- <p>{userInfo.Subs}</p> -->
            <!--<p class="text-muted-foreground">Subscribers</p>-->
          </div>
        </div>
      </CardContent>
    </Card>

    <Tabs.Root bind:value class="max-w-prose ">
      <Tabs.List class="grid grid-cols-4">
        <Tabs.Trigger on:click={fetchPost} value="post">Post</Tabs.Trigger>
        <Tabs.Trigger on:click={fetchPost} value="media">Media</Tabs.Trigger>
        <Tabs.Trigger on:click={fetchSubscriptions} value="subscribed"
          >Subscribed</Tabs.Trigger
        >
        <Tabs.Trigger on:click={fetchSubs} value="assets">Assets</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="post">
        {#each posts as post}
          <div class="border border-border">
            <PostComponent {post} />
          </div>
        {/each}
      </Tabs.Content>
      <Tabs.Content value="media">
        {#each media as post}
          <div class="border border-border max-w-prose">
            <PostComponent {post} />
          </div>
        {/each}
      </Tabs.Content>
      <Tabs.Content value="subscribed">
        <Users addresss={profile.followList} />
      </Tabs.Content>
      <Tabs.Content value="assets">
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
