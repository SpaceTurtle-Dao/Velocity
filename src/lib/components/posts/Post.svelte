<script lang="ts">
  import Reply from "$lib/components/views/engagement/Reply.svelte";
  import { onMount } from "svelte";
  import { CornerDownRight, Repeat2Icon } from "lucide-svelte";
  import Nip92 from "$lib/handlers/NIP92.svelte";
  import Like from "$lib/components/views/engagement/Like.svelte";
  import Repost from "$lib/components/views/engagement/Repost.svelte";
  import Buy from "$lib/components/views/engagement/Buy.svelte";
  import Share from "$lib/components/views/engagement/Share.svelte";
  import { createEventDispatcher } from "svelte";
  import { link } from "svelte-spa-router";
  import * as Dialog from "$lib/components/ui/dialog";
  import ProfilePictureHoverCard from "../UserProfile/ProfilePictureHoverCard.svelte";
  import { formatTimestamp } from "$lib/utils/timestamp.utils";
  import ProfileHoverCard from "$lib/components/UserProfile/ProfileHoverCard.svelte";
  import type { Profile } from "$lib/models/Profile";
  import { profileService } from "$lib/services/ProfileService";
  import { hubService } from "$lib/services/HubService";
  import { PostType, type Post } from "$lib/models/Post";
  import { currentUser } from "$lib/stores/currentUser.store";
  import type { Hub } from "$lib/models/Hub";
  import { PROFILE_REGISTRY_ID } from "$lib/constants";
  import type { Zone } from "$lib/models/Zone";
  import { hubRegistryService } from "$lib/services/HubRegistryService";

  export let post: Post;
  //let hub: Hub;
  let replies: Post[] = [];
  let profile: Profile;
  let replyingTo: Profile;
  let replyCount = 0;
  let hubZone: Zone;
  let isLoading: boolean = false;
  let loadError: string | null = null;
  let dialogOpen = false;

  /*hubRegistryService.subscribe((hubs) => {
    if (!$currentUser.address) return;
    if (hubs.has($currentUser.address)) {
      let _hubZone = hubs.get($currentUser.address);
      if (_hubZone) hubZone = _hubZone;
    }
  });*/

  profileService.subscribe((profiles) => {
    if (profiles.has(post.owner)) {
      profile = profiles.get(post.owner)!;
    }
  });

  function transformEventToPost(
    event: any,
    isRepost = false,
    originalEvent = null,
  ) {
    return {
      id: event.Id,
      from: event.From,
      timestamp: event.Timestamp,
      content: event.Tags?.["Content"] || "",
      isReply: event.Tags?.["marker"] === "reply",
      isRepost,
      originalEvent,
    };
  }

  async function loadData() {
    profileService.fetchProfiles(post.from, [post.owner]);
    //hub = profile.hubId;
    //replies = await hubService.fetchReplies(hub, postId);
    //replyCount = replies.length;
    //hubService.fetchRepost(hub, postId);
  }

  onMount(async () => {
    loadData();
  });

  const dispatch = createEventDispatcher();

  function handleNewReply(replyEvent: any) {
    const newReply = transformEventToPost(
      replyEvent.detail,
      true,
      //@ts-ignore
      { e: post.id },
    );

    replies = [...replies, replyEvent.detail];
    dispatch("newReply", replyEvent.detail);
    replyCount += 1;
  }

  function handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest(".engagement-buttons")) {
      dialogOpen = true;
    }
  }
</script>

<div class="cursor-pointer border border-border">
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
          {#if post.type == PostType.Reply && post.p}
            <div class="flex items-center text-muted-foreground mb-2">
              <CornerDownRight size={16} class="mr-2" />
              {#await profileService.fetchProfiles(post.from, [post.p]) then _profile}
                {#if $profileService.has(post.p)}
                  <span class="text-sm"
                    >Replying to @{$profileService.get(post.p)?.userName}</span
                  >
                {/if}
              {/await}
            </div>
          {/if}
          {#if post.rePost && profile}
            <div class="flex items-center text-muted-foreground mb-2">
              <Repeat2Icon size={16} class="mr-2" />
              <span class="text-sm">
                {#if profile.owner == $currentUser?.address}
                  You Reposted
                {:else}
                  Reposted by @{profile.userName}
                {/if}
              </span>
            </div>
          {/if}

          <a use:link href={`/post/${post.from}/${post.id}`}>
            <div>
              <div class="flex justify-start space-x-3">
                {#if post.rePost && profile}
                  {#await profileService.fetchProfiles(post.from, [post.rePost.owner])}
                    <div
                      class="hidden sm:block h-9 w-9 rounded-full bg-gray-200 animate-pulse"
                    ></div>
                  {:then _profile}
                    <div>
                      {#if $profileService.has(post.rePost.from)}
                        <ProfilePictureHoverCard
                          profile={$profileService.get(
                            post.rePost.from,
                          )}
                        />
                      {/if}
                    </div>
                  {/await}
                {:else if profile}
                  <div>
                    <ProfilePictureHoverCard {profile} />
                  </div>
                {:else}
                  <div
                    class="hidden sm:block h-9 w-9 rounded-full bg-gray-200 animate-pulse"
                  ></div>
                {/if}
                <div class="flex-1">
                  <div class="flex space-x-1 mb-1">
                    {#if post.rePost}
                      {#await profileService.fetchProfiles(post.rePost.from, [post.rePost.owner])}
                        <div
                          class="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"
                        ></div>
                      {:then _profile}
                        {#if $profileService.get(post.rePost.from)}
                          <ProfileHoverCard
                            profile={($profileService.get(post.rePost.owner))}
                          >
                            <div class="flex space-x-1">
                              <p class="font-medium text-primary">
                                {$profileService.get(post.rePost.owner)?.userName}
                              </p>
                              <span
                                class="text-muted-foreground pl-0.5 text-ellipsis"
                                >@{$profileService.get(post.rePost.owner)?.displayName}</span
                              >
                            </div>
                          </ProfileHoverCard>
                        {/if}
                      {/await}
                    {:else if profile}
                      <ProfileHoverCard {profile}>
                        <div class="flex space-x-1">
                          <p class="font-medium text-primary">
                            {profile.userName}
                          </p>
                          <span
                            class="text-muted-foreground pl-0.5 text-ellipsis"
                            >@{profile.displayName}</span
                          >
                        </div>
                      </ProfileHoverCard>
                    {:else}
                      <div
                        class="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"
                      ></div>
                    {/if}
                    <span class="text-muted-foreground"
                      >· {formatTimestamp(post.timestamp)}</span
                    >
                  </div>

                  <div class="text-gray-200">
                    {#if post.rePost}
                      <Nip92 post={post.rePost} />
                    {:else}
                      <Nip92 {post} />
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <div class="flex justify-between mt-3 engagement-buttons">
            {#if post.rePost}
              <div class="flex items-center">
                <Reply
                  hubId={post.rePost.from}
                  post={post.rePost}
                  on:newReply={handleNewReply}
                />
                <span class="ml-1 text-sm text-muted-foreground">
                  {replyCount}
                </span>
              </div>
              <Repost post={post.rePost} />
              <Like post={post.rePost} />
              <Buy />
            {:else}
              <div class="flex items-center">
                <Reply hubId={post.from} {post} on:newReply={handleNewReply} />
                <span class="ml-1 text-sm text-muted-foreground">
                  {replyCount}
                </span>
              </div>
              <Repost {post} />
              <Like {post} />
              <Buy />
            {/if}
            <Share />
          </div>
        </div>
      {/if}
    </Dialog.Trigger>
  </Dialog.Root>
</div>
