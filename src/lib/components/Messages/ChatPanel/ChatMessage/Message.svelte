<script lang="ts">
  import formatMessageTime from "$lib/utils/message.utils";

  type Message = {
    id: string;
    type: "sent" | "received";
    content: string;
    timestamp: number;
  };
  export let message: Message;
</script>

<div
  class="flex flex-col {message.type === 'sent' ? 'items-end' : 'items-start'}"
>
  <div
    class="rounded-lg p-3 max-w-[70%] {message.type === 'sent'
      ? 'bg-[rgb(29,155,240)] text-primary'
      : 'bg-secondary text-secondary-foreground'}"
  >
    <p>{message.content}</p>
  </div>
  <span class="text-xs mt-1 block text-muted-foreground">
    {formatMessageTime(message.timestamp)}
  </span>
</div>
