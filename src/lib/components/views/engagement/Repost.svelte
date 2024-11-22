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
  let isQuote = false; //TO-DO do the quote work
  let count = 0;

  let repostArray: Array<any> = [];
  let _tags: Array<Tag> = [];

  async function repost() {
    reposted = !reposted;
    let value = "";
    let kind: Tag = {
      name: "Kind",
      value: "6",
    };
    let _content = _event;
    let contentTag: Tag = {
      name: "Content",
      value: JSON.stringify(_content),
    };
    let eTag: Tag = {
      name: "e",
      value: _event.Id.toString(),
    };
    let markerTag: Tag = {
      name: "marker",
      value: "root",
    };
    _tags.push(kind);
    _tags.push(contentTag);
    _tags.push(eTag);
    _tags.push(markerTag);
    await event(_tags);
  }

  async function fetchRepost() {
    let filters: Array<any> = [];
    repostArray = [];
    let filter1 = {
      kinds: ["6"],
      //since: Number(timestamp),
      //until: Date.now(),
      //limit: 100,
    };
    let filter2 = {
      tags: {
        e: [_event.Id],
        //p: [_event.From]
      },
    };
    filters.push(filter1, filter2);
    let _filters = JSON.stringify(filters);
    repostArray = await fetchEvents(_filters);
    for (var i = 0; i < repostArray.length; i++) {
      if (repostArray[i].From == $currentUser.address) {
        reposted = true;
      } else {
        reposted = false;
      }
    }

    console.log("reposting array", repostArray);
    filters = [];
  }

  onMount(async () => {
    // console.log($currentUser.Process);
    console.log("getting repost for id");
    console.log(_event.Id);
    await fetchRepost();
    console.log("got " + repostArray.length + " repost for id");
    console.log(_event.Id);
    console.log(repostArray);
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
    <!--<p class="font-thin text-green-400">{count}</p>-->
  {:else}
    <Repeat2 strokeWidth={0.8} class="text-primary" />
    <!--<p class="font-thin">{count}</p>-->
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
