<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar";
  import EmptyInbox from "./EmptyInbox.svelte";
  import InboxItem from "./InboxItem.svelte";
  import { mockChatThreads } from "./inboxMockData";
</script>

<div class="border-x border-border h-full">
  <div class="border-b border-border p-4">
    <h2 class="text-xl font-bold text-primary">Inbox</h2>
  </div>

  <!-- <EmptyInbox /> -->

  {#each mockChatThreads as { user, lastMessage, unreadCount }, index (index)}
    <InboxItem
      name={user.name}
      username={user.username}
      message={lastMessage}
      {unreadCount}
      on:click={() => {
        console.log("clicked on message " + index + " from " + user.name);
      }}
    />
  {/each}
</div>
