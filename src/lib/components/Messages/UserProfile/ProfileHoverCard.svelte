<script lang="ts">
  import * as HoverCard from "$lib/components/ui/hover-card";
  import ProfilePicture from "./ProfilePicture.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { link } from "svelte-spa-router";

  export let image = "";
  export let name: string;
  export let username: string;
  export let about: string = "";
  export let isSubscribed = true;
  export let website = "";
  export let subscribers = 0;
  export let subscribing = 0;
  export let processId;

  function getDisplayUrl(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
    } catch {
      return url;
    }
  }

  function handleSubscribeAndUnsubscribe() {
    isSubscribed = !isSubscribed;
  }
</script>

<HoverCard.Root>
  <HoverCard.Trigger>
    <a href="/profile/{processId}" use:link>
      <slot />
    </a>
  </HoverCard.Trigger>
  <HoverCard.Content align="start">
    <div class="flex justify-between">
      <ProfilePicture {name} src={image} size="xl" />

      {#if isSubscribed}
        <Button
          variant="outline"
          class="group text-base font-bold h-9 w-32 rounded-full text-primary border hover:border-red-800"
          on:click={handleSubscribeAndUnsubscribe}
        >
          <span class="group-hover:hidden">Subscribed</span>
          <span class="hidden group-hover:block text-red-500"
            >Unsubscribe
          </span>
        </Button>
      {:else}
        <Button
          class="group text-base font-bold h-9 w-32 rounded-full"
          on:click={() => (isSubscribed = !isSubscribed)}
          >Subscribe
        </Button>
      {/if}
    </div>

    <div class="text-primary text-lg font-bold">
      {name}
    </div>

    <div class="text-muted-foreground text-base font-normal">
      {username}
    </div>

    {#if about}
      <div class="text-primary text-base font-normal mt-4">{about}</div>
    {/if}

    {#if website}
      <div class="mt-4">
        <a
          class="text-blue-500 hover:underline"
          href={website}
          target="_blank"
          rel="noopener noreferrer"
        >
          {getDisplayUrl(website)}
        </a>
      </div>
    {/if}

    <div class="flex justify-between mt-4">
      <div>
        <span class="text-sm font-bold">{subscribing}</span>
        <span class="text-sm font-normal text-muted-foreground"
          >Subscribing</span
        >
      </div>
      <div>
        <span class="text-sm font-bold">{subscribers}</span>
        <span class="text-sm font-normal text-muted-foreground"
          >Subscribers</span
        >
      </div>
    </div>
  </HoverCard.Content>
</HoverCard.Root>
