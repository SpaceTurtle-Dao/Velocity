<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar";

  interface Message {
    id: string;
    content: string;
    timestamp: string;
    read: boolean;
  }

  interface $$Props {
    avatarUrl?: string;
    name: string;
    username: string;
    message: Message;
    unreadCount?: number;
  }

  export let avatarUrl = "";
  export let name: string;
  export let username: string;
  export let message: Message;
  export let unreadCount = 0;

  $: isUnread = !message.read && unreadCount > 0;

  function formatTimestamp(timestamp: string): string {
    // Missing Logic here
    return timestamp;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && event.currentTarget instanceof HTMLElement) {
      event.currentTarget.click();
    }
  }
</script>

<div
  class="flex w-full p-4 hover:bg-muted rounded cursor-pointer group"
  role="button"
  tabindex="0"
  on:click
  on:keydown={handleKeyDown}
>
  <Avatar.Root class="mr-2">
    <Avatar.Image src={avatarUrl} alt={name} />
    <Avatar.Fallback class="text-primary"
      >{name.slice(0, 2).toUpperCase()}</Avatar.Fallback
    >
  </Avatar.Root>

  <div class="min-w-0 w-full">
    <div class="flex justify-between items-center">
      <div class="flex min-w-0 overflow-hidden whitespace-nowrap">
        <div class="text-primary text-base font-medium mr-1">
          {name}
        </div>
        <div class="text-muted-foreground text-base font-light truncate">
          {username}
        </div>
      </div>

      <!-- <div class="ml-2 text-muted-foreground text-sm">{message.timestamp}</div> -->
      <time
        datetime={message.timestamp}
        class="text-muted-foreground pl-2 text-sm shrink-0 group-hover:transition-all group-hover:duration-400 group-hover:ease-out group-hover:-translate-x-6 group-hover:bg-muted origin-right"
      >
        {formatTimestamp(message.timestamp)}
      </time>
      <!-- /// -->
    </div>

    <div class="flex justify-between items-center">
      <div
        class:text-primary={isUnread}
        class:text-muted-foreground={!isUnread}
        class="text-sm truncate"
      >
        {message.content}
      </div>

      {#if isUnread}
        <span
          class="ml-2 flex shrink-0 items-center justify-center text-xs w-5 h-5 bg-primary text-primary-foreground rounded-full"
          aria-label={`${unreadCount} unread messages`}
        >
          {unreadCount}
        </span>
      {/if}
    </div>
  </div>
</div>
