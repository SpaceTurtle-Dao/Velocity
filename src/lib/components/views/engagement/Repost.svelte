<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Repeat2 } from "lucide-svelte";
    import { onMount } from "svelte";
    import { event } from "$lib/ao/relay";
    import type {Tag} from "$lib/models/Tag";
    import { currentUser } from "$lib/stores/profile.store";

    let reposted = false;
    let count = 0
    export let _event: any;

   async  function repost() {
        reposted = !reposted

    let kind: Tag = {
      name: "Kind",
      value: "6",
    };
    let markerTag: Tag = {
      name: "marker",
      value: "root",
    };
    let _tags: Array<Tag> = [kind, markerTag];
    let _content = _event.Id.toString();
    let contentTag: Tag = {
      name: "Content",
      value: _content,
    };
    let eTag: Tag = {
      name: "e",
      value: "orginal post id",
    };

    _tags.push(contentTag);
    _tags.push(eTag);
    await event(_tags, $currentUser.Process);
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
        <Repeat2 strokeWidth={0.8} class="text-primary"/>
        <p class="font-thin">{count}</p>
    {/if}
</Button>
