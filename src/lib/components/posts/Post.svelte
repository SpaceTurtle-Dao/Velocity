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
  import ProfilePictureHoverCard from "../UserProfile/ProfilePictureHoverCard.svelte";
  import { formatTimestamp } from "$lib/utils/timestamp.utils";
  import ProfileHoverCard from "$lib/components/UserProfile/ProfileHoverCard.svelte";
  import type { Profile } from "$lib/models/Profile";
  import { profileService } from "$lib/services/ProfileService";
  import { postService } from "$lib/services/PostService";
  import { PostType, type Post } from "$lib/models/Post";

  export let post: Post;
  let replies: Post[] = [];
  let profile: Profile;
  let replyingTo: Profile;
  let replyCount = 0;

  let isLoading: boolean = false;
  let loadError: string | null = null;
  let dialogOpen = false;

  /*profileService.subscribe((profiles) => {
    if (post.type == PostType.Repost) {
      if (!post.p || !profiles.has(post.p)) return;
      profile = profiles.get(post.p);
    } else if (post.type == PostType.Reply) {
      if (!post.p || !profiles.has(post.p)) return;
      replyingTo = profiles.get(post.p);
      if (!profiles.has(post.from)) return;
      profile = profiles.get(post.from);
    } else {
      if (!profiles.has(post.from)) return;
      profile = profiles.get(post.from);
    }
  });*/

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

  async function loadData(from: string, postId: string) {
    profileService.get(from).then((value) => {
      profile = value;
    });
    postService.fetchReplies(postId).then((values) => {
      replies = values;
      replyCount = replies.length;
    });
    //postService.fetchRepost(postId);
  }

  onMount(async () => {
    //isLoading = true;
    if (post.type == PostType.Repost) {
      if (!post.p) return;
      loadData(post.p, post.id);
    } else {
      loadData(post.from, post.id);
    }
  });

  const dispatch = createEventDispatcher();

  function handleNewReply(replyEvent: any) {
    const newReply = transformEventToPost(
      replyEvent.detail,
      true,
      //@ts-ignore
      { e: event.Id },
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
          {#if post.type == PostType.Reply && post.p}
            <div class="flex items-center text-muted-foreground mb-2">
              <CornerDownRight size={16} class="mr-2" />
              {#await profileService.get(post.p) then _profile}
                <span class="text-sm">Replying to @{_profile.name}</span>
              {/await}
            </div>
          {/if}
          {#if post.rePost}
            <div class="flex items-center text-muted-foreground mb-2">
              <Repeat2Icon size={16} class="mr-2" />
              <span class="text-sm">
                {#if profile.address == $currentUser?.address}
                  You Reposted
                {:else}
                  Reposted by @{profile.name}
                {/if}
              </span>
            </div>
          {/if}

          <a use:link href={`/post/${post.from}/${post.id}`}>
            <div>
              <div class="flex justify-start space-x-3">
                {#if post.rePost && profile}
                  <div>
                    <ProfilePictureHoverCard {profile} />
                  </div>
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
                    {#if post.rePost && profile}
                      <ProfileHoverCard {profile}>
                        <div class="flex space-x-1">
                          <p class="font-medium text-primary">
                            {profile.name}
                          </p>
                          <span
                            class="text-muted-foreground pl-0.5 text-ellipsis"
                            >@{profile.display_name}</span
                          >
                        </div>
                      </ProfileHoverCard>
                    {:else if profile}
                      <ProfileHoverCard {profile}>
                        <div class="flex space-x-1">
                          <p class="font-medium text-primary">
                            {profile.name}
                          </p>
                          <span
                            class="text-muted-foreground pl-0.5 text-ellipsis"
                            >@{profile.display_name}</span
                          >
                        </div>
                      </ProfileHoverCard>
                    {:else}
                      <div
                        class="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"
                      ></div>
                    {/if}
                    <!--<span class="text-muted-foreground"
                      >· {formatTimestamp(post.timestamp)}</span
                    >-->
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
            <div class="flex items-center">
              <Reply {post} on:newReply={handleNewReply} />
              <span class="ml-1 text-sm text-muted-foreground">
                {replyCount}
              </span>
            </div>
            <!--<Repost {post} />
            <Like {post} />-->
            <Buy />
            <Share />
          </div>
        </div>
      {/if}
    </Dialog.Trigger>
  </Dialog.Root>
</div>
