<script lang="ts">
  import Reply from "$lib/components/views/engagement/Reply.svelte";
  import { onMount } from "svelte";
  import { fetchEvents } from "$lib/ao/relay";
  import { CornerDownRight, Repeat2Icon } from "lucide-svelte";
  import Nip92 from "$lib/handlers/NIP92.svelte";
  import Like from "$lib/components/views/engagement/Like.svelte";
  import Repost from "$lib/components/views/engagement/Repost.svelte";
  import Buy from "$lib/components/views/engagement/Buy.svelte";
  import Share from "$lib/components/views/engagement/Share.svelte";
  import { createEventDispatcher } from "svelte";
  import { currentUser } from "$lib/stores/current-user.store";
  import { link } from "svelte-spa-router";
  import * as Dialog from "$lib/components/ui/dialog";
  import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
  import { formatTimestamp } from "$lib/utils/timestamp.utils";
  import { FetchEvents } from "$lib/ao/messegeFactory.svelte";
  import type { Profile } from "$lib/models/Profile";
  import { usersProfile } from "$lib/stores/users-profile.store";

  export let event: any;
  export let replies: any[] = [];
  //   export let showFullPost: boolean = false;

  let replyCount = 0;

  $: profile = $usersProfile.get(event.From);

  let isReply: boolean = false;
  let replyingTo: string | null = null;
  let isRepost: boolean = false;
  let originalEvent: any = null;
  let originalUser: any = null;
  let originalProfile: any = null;
  let isLoading: boolean = true;
  let loadError: string | null = null;
  let repostArray: any[] = [];
  let dialogOpen = false;

  console.log("working");

  $: {
    if (event) {
      loadEventData();
    }
  }

  async function parseRepostContent() {
    if (!event?.Tags?.["Content"]) return null;

    try {
      const parsed = JSON.parse(event.Tags["Content"]);
      if (!parsed || !parsed.From) {
        console.error("Invalid repost content structure");
        return null;
      }
      return parsed;
    } catch (error) {
      console.error("Failed to parse repost content:", error);
      return null;
    }
  }

  async function countReposts() {
    let repostFilter = JSON.stringify([
      {
        kinds: ["6"],
        tags: { e: originalEvent.Id.toString() },
      },
    ]);
    repostArray = await fetchEvents(repostFilter);
    console.log("reposts array", repostArray);
  }

  async function loadEventData() {
    isLoading = true;
    loadError = null;

    try {
      // profile = await usersProfile.get(event.From);

      // Check for reply
      if (event.Tags["marker"] === "reply") {
        isReply = true;
        replyingTo = event.Tags["p"];
      }

      // Check for repost
      if (event.Tags["Kind"] === "6") {
        isRepost = true;
        const parsedContent = await parseRepostContent();
        if (parsedContent) {
          originalEvent = parsedContent;

          // Load original post author info
          originalUser = await fetchEvents(parsedContent.From);
          if (originalUser?.Profile) {
            originalProfile = originalUser.Profile;
          } else {
            console.warn("Original user profile not found");
          }
        }
      }
      await countReplies();
      isLoading = false;
    } catch (error) {
      console.error("Error loading event data:", error);
      loadError = "Failed to load post data";
    } finally {
    }
  }

  onMount(() => {
    if (event) {
      loadEventData();
    }
  });

  const dispatch = createEventDispatcher();

  function handleNewReply(replyEvent: any) {
    replies = [...replies, replyEvent.detail];
    dispatch("newReply", replyEvent.detail);
    replyCount += 1;
    dispatch("newReply", replyEvent.detail);
  }

  function handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest(".engagement-buttons")) {
      dialogOpen = true;
    }
  }

  async function countReplies() {
    if (!event?.Id) return;

    try {
      let replyFilter = JSON.stringify([
        {
          kinds: ["1"],
          tags: { marker: ["reply"] },
        },
        {
          tags: { e: [event.Id] },
        },
      ]);

      const replies = await fetchEvents(replyFilter);
      replyCount = replies.length;
    } catch (error) {
      console.error("Error counting replies:", error);
    }
  }
</script>

<div class="cursor-pointer border-b border-gray-800">
  <Dialog.Root>
    <Dialog.Trigger asChild>
      {#if isLoading}
        <div class="p-4">
          <div>
            <div class="flex items-center text-gray-500 mb-2">
              <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div>
              <div class="flex justify-start space-x-2">
                <div
                  class="hidden sm:block h-9 w-9 rounded-full bg-gray-200 animate-pulse"
                ></div>

                <div class="flex-1">
                  <div
                    class="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2"
                  ></div>
                  <div class="space-y-2">
                    <div
                      class="h-4 w-full bg-gray-200 rounded animate-pulse"
                    ></div>
                    <div
                      class="h-4 w-3/4 bg-gray-200 rounded animate-pulse"
                    ></div>
                    <div
                      class="h-4 w-1/2 bg-gray-200 rounded animate-pulse"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="flex justify-between py-4">
                {#each Array(5) as _}
                  <div class="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {:else if loadError}
        <div class="p-4 text-red-500">
          {loadError}
        </div>
      {:else}
        <div class="p-4">
          {#if isReply}
            <div class="flex items-center text-muted-foreground mb-2">
              <CornerDownRight size={16} class="mr-2" />
              <span class="text-sm">Replying to @{replyingTo}</span>
            </div>
          {/if}

          {#if isRepost && profile?.name}
            <div class="flex items-center text-muted-foreground mb-2">
              <Repeat2Icon size={16} class="mr-2" />
              <span class="text-sm"
                >Reposted by
                {#if profile?.name == $currentUser?.name}
                  You
                {:else}
                  @{profile.name}
                {/if}
              </span>
            </div>
          {/if}

          <a use:link href={`/post/${event.From}/${event.Id}`}>
            <div>
              <div class="flex justify-start space-x-3">
                <div class="hidden sm:flex">
                  <ProfilePicture
                    src={isRepost ? originalProfile.picture : profile?.picture}
                    name={isRepost
                      ? originalProfile.name
                      : (profile?.name ?? "")}
                  />
                </div>

                <div class="flex-1">
                  <div class="flex space-x-1 mb-1">
                    <p class="font-medium text-primary">
                      {#if isRepost && originalProfile?.name}
                        {originalProfile.name}
                      {:else}
                        {profile?.name}
                      {/if}
                    </p>
                    <span class="text-muted-foreground pl-0.5"
                      >@{isRepost
                        ? originalProfile.display_name
                        : profile?.display_name}</span
                    >

                    <span class="text-muted-foreground"
                      >· {formatTimestamp(event.Timestamp)}</span
                    >
                  </div>

                  <div class="text-gray-200">
                    {#if isRepost && originalEvent}
                      <Nip92 event={originalEvent} />
                    {:else}
                      <Nip92 {event} />
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <div class="flex justify-between mt-3 engagement-buttons">
            <div class="flex items-center">
              <Reply {event} on:newReply={handleNewReply} />
              {#if replyCount > 0}
                <span class="ml-1 text-sm text-muted-foreground">
                  {replyCount}
                </span>
              {/if}
            </div>
            <Repost _event={isRepost ? originalEvent : event} />
            <Like _event={isRepost ? originalEvent : event} />
            <Buy />
            <Share />
          </div>
        </div>
      {/if}
    </Dialog.Trigger>
  </Dialog.Root>
</div>
