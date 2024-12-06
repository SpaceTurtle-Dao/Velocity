<script lang="ts">
  import { upload } from "$lib/ao/uploader";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Repeat2 } from "lucide-svelte";
  import { onMount } from "svelte";
  import { fetchEvents, event } from "$lib/ao/relay";
  import type { Tag } from "$lib/models/Tag";
  import { currentUser } from "$lib/stores/current-user.store";

  export let _event: any;

  let reposted = false;
  let isQuote = false; // TO-DO: implement quote functionality

  let repostArray: Array<any> = [];
  let _tags: Array<Tag> = [];

  // Reactive statement to update count based on repostArray
  $: count = repostArray.length;

  async function repost() {
    if (!_event) return;

    let _tags: Array<Tag> = [
      {
        name: "Kind",
        value: "6"
      },
      {
        name: "Content",
        value: JSON.stringify({
          ..._event,
          repostedBy: $currentUser.address
        })
      },
      {
        name: "e",
        value: _event.Id.toString()
      },
      {
        name: "marker",
        value: "root"
      }
    ];

    await event(_tags);
    
    // Immediately update local state
    reposted = true;
    
    // Refresh reposts to ensure consistency
    await fetchRepost();
  }

  async function fetchRepost() {
    let filters: Array<any> = [];
    repostArray = [];
    
    let filter1 = {
      kinds: ["6"],
      tags: {
        e: [_event.Id]
      }
    };
    
    let _filters = JSON.stringify([filter1]);
    repostArray = await fetchEvents(_filters);
    
    // Check if current user has reposted
    reposted = repostArray.some(repost => repost.From === $currentUser.address);
  }

  onMount(async () => {
    console.log("Getting reposts for id:", _event.Id);
    await fetchRepost();
    console.log(`Got ${repostArray.length} reposts for id ${_event.Id}`);
  });
</script>

<Button
  variant="ghost"
  size="icon"
  class="flex flex-row text-primary space-x-1 bg-transparent hover:bg-transparent"
  on:click={repost}
>
  {#if reposted}
    <Repeat2 strokeWidth={0.8} class="text-green-400" />
    <p class="font-thin text-green-400">{count}</p>
  {:else}
    <Repeat2 strokeWidth={0.8} class="text-primary" />
    <p class="font-thin">{count}</p>
  {/if}
</Button>

<!-- <script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Repeat2 } from "lucide-svelte";
  import { event } from "$lib/ao/relay";
  import {upload} from "$lib/ao/uploader";
  import type { Tag } from "$lib/models/Tag";
  import { currentUser } from "$lib/stores/profile.store";
  import { onMount } from "svelte";

  let reposted = false;
  let count = 0;
  let isLoading = false;
  export let _event: any;

  onMount(() => {
    // count = _event.repostCount || 0;
    // reposted = _event.reposted || false;
  });

  async function repost() {
    if (isLoading) return;
    isLoading = true;

    reposted = !reposted;

    let kind: Tag = {
      name: "Kind",
      value: "6",
    };
    let markerTag: Tag = {
      name: "marker",
      value: "repost",
    };
    let eTag: Tag = {
      name: "e",
      value: _event?.Id.toString(),
    };

    let _tags: Array<Tag> = [kind, markerTag, eTag];

    // if (_event.media) {
    //   let media = await upload(_event.media);
    //   let urlTag: Tag = {
    //     name: "url",
    //     value: media.url,
    //   };
    //   let mTag: Tag = {
    //     name: "mimeType",
    //     value: media.mimeType || "",
    //   };
      // _tags.push(urlTag);
      // _tags.push(mTag);
    // }

    let contentTag: Tag = {
      name: "Content",
      value: JSON.stringify(_event),
    };
    _tags.push(contentTag);

    await event(_tags, $currentUser.Process);

    if (reposted) {
      count += 1;
    } else {
      count -= 1;
    }

    isLoading = false;
  }
</script>

<Button
  variant="ghost"
  size="icon"
  class="flex flex-row text-primary space-x-1 bg-transparent hover:bg-transparent"
  on:click={repost}
>
  {#if reposted}
    <Repeat2 strokeWidth={0.8} class="text-green-400" />
    <p class="font-thin text-green-400">{count}</p>
  {:else}
    <Repeat2 strokeWidth={0.8} class="text-primary" />
    <p class="font-thin">{count}</p>
  {/if}
</Button> -->
