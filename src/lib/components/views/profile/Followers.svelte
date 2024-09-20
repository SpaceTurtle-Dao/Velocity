<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { subscribers } from "../../../../stores/profile.store";
  import { profileFromEvent, type UserInfo } from "$lib/models/Profile";
  import Follow from "./Follow.svelte";

  export let relay: string;
  export let userRelay: string;
  export let token: string;
  export let quantity: string;

  let _subscribers: Array<UserInfo> = [];

  //@ts-ignore
  subscribers.subscribe((value) => {
    _subscribers = value;
  });

  function getActionFromTags(tags: string[][]): string {
    const actionTag = tags.find((tag) => tag[0] === "Action");
    return actionTag ? actionTag[1] : "Unknown";
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  function toUrl(tx: string) {
    return (
      "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
      tx
    );
  }

</script>

<!--<div class="events-list">
  <h1>Events</h1>
  {#each _subscribers as subscriber}
    <div class="event-item">
      <h2>{getActionFromTags(subscriber.Profile.tags)}</h2>
      <p>{subscriber.Profile.pubkey}</p>
      <small
        >Created at: {formatDate(subscriber.Profile.created_at.toString())} by {subscriber
          .Profile.pubkey}</small
      >
    </div>
  {/each}
</div>

<div class="p-4 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold text-purple-600 mb-4">Followers</h2>
  <ul class="space-y-2">
    {#each _subscribers as subscriber}
      <li class="p-3 bg-gray-100 rounded-lg shadow-sm">
        {subscriber.Profile.pubkey}
      </li>
    {/each}
  </ul>
</div>-->

<Card.Root
  data-x-chunk-name="dashboard-01-chunk-5"
  data-x-chunk-description="A card showing a list of recent sales with customer names and email addresses."
  class="border-border"
>
  <Card.Header>
    <Card.Title>Subscribers</Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-8">
      {#each _subscribers as subscriber}
      <div class="flex items-center gap-4">
        <Avatar.Root class="hidden h-9 w-9 sm:flex">
          <Avatar.Image src={toUrl(profileFromEvent(subscriber.Profile).picture)} alt="Avatar" />
          <Avatar.Fallback>OM</Avatar.Fallback>
        </Avatar.Root>
        <div class="grid gap-1">
          <p class="text-sm font-medium leading-none">{profileFromEvent(subscriber.Profile).name}</p>
          <p class="text-muted-foreground text-sm">{subscriber.Profile.pubkey}</p>
        </div>
        <Follow {relay} {userRelay} {token} {quantity} />
      </div>
      {/each}
  </Card.Content>
</Card.Root>
