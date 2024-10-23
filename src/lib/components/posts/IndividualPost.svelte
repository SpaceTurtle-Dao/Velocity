<script lang="ts">
  console.log("Loading it is!!");
  import { onMount } from "svelte";
  import { _fetchEvents, info, event as aoEvent } from "$lib/ao/relay";
  import Post from "$lib/components/posts/Post.svelte";
  import Reply from "$lib/components/views/engagement/Reply.svelte";
  import {
    Avatar,
    AvatarImage,
    AvatarFallback,
  } from "$lib/components/ui/avatar";
  import Nip92 from "$lib/handlers/NIP92.svelte";
  import Like from "$lib/components/views/engagement/Like.svelte";
  import Repost from "$lib/components/views/engagement/Repost.svelte";
  import Buy from "$lib/components/views/engagement/Buy.svelte";
  import Share from "$lib/components/views/engagement/Share.svelte";
  import { currentUser } from "$lib/stores/profile.store";
  import { afterUpdate } from "svelte";

  // Set the current URL
  let url = window.location.href.split("/");
  let id = url.pop() || "/";
  let user = url.pop() || "/";

  console.log("Answer it");

  // Set it as soon as pages update
  afterUpdate(() => {
    let url = window.location.href.split("/");
    id = url.pop() || "/";
    user = url.pop() || "/";
  });

  console.log("user is this", user);

  console.log("Id is this", id);

  let post: any = null;
  let replies: any[] = [];
  let _user: any;
  let profile: any;

  onMount(async () => {
    // Fetch the post
    let postFilter = JSON.stringify([
      {
        kinds: ["1"],
        marker: "root",
        //   ids: [id],
        //   limit: 1
      },
    ]);
    let postResults = await _fetchEvents(user, postFilter);
    if (postResults.length > 0) {
      post = postResults[0];
      _user = await info(post.From);
      profile = _user.Profile;
      console.log("Post filter object", postFilter);
      console.log("Post results", postResults);
    }

    console.log("Post filter object", postFilter);
    console.log("Post results", postResults);

    //Fetch replies
    let replyFilter = JSON.stringify([
      {
        kinds: ["1"],
        limit: 100,
        tags: { marker: ["reply"] },
      },
      {
        tags: { e: [id] },
      },
    ]);
    replies = await _fetchEvents($currentUser.Process, replyFilter);
  });

  async function handleNewReply(replyEvent: any) {
    let newReply = replyEvent.detail;

    // Add reply-specific tags
    let eTag = { name: "e", value: post.Id };
    let pTag = { name: "p", value: post.From };
    let markerTag = { name: "marker", value: "reply" };
    newReply.Tags.push(eTag, pTag, markerTag);

    // Send the new reply event
    await aoEvent(newReply.Tags, $currentUser.Process);

    // Update the replies list
    replies = [newReply, ...replies];
  }
</script>

<div class="max-w-2xl mx-auto mt-8">
  {#if post}
    <div class="border border-border rounded-lg overflow-hidden">
      <div class="p-4">
        <div class="flex items-start space-x-3">
          <Avatar class="h-10 w-10">
            {#if profile?.picture}
              <AvatarImage src={profile.picture} alt="Avatar" />
            {:else}
              <AvatarFallback>{profile?.name?.[0] || "U"}</AvatarFallback>
            {/if}
          </Avatar>
          <div>
            <p class="font-semibold text-primary">{profile?.name}</p>
            <Nip92 event={post} />
          </div>
        </div>
        <div class="flex justify-between mt-4">
          <Reply event={post} user={_user} on:newReply={handleNewReply} />
          <Repost />
          <Like _event={post} />
          <Buy />
          <Share />
        </div>
      </div>
    </div>

    <div class="mt-4">
      <h2 class="text-xl font-semibold mb-4">Replies</h2>
      {#each replies as reply (reply.Id)}
        <div class="border border-border rounded-lg overflow-hidden mb-4">
          <Post event={reply} />
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-white">Loading...</p>
  {/if}
</div>
