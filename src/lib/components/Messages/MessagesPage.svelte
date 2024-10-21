<script lang="ts">
  import ChatPanel from "./ChatPanel/ChatPanel.svelte";
  import InboxPanel from "./InboxPanel/InboxPanel.svelte";
</script>

<div class="flex h-screen">
  <div class="w-5/12 h-full">
    <InboxPanel />
  </div>

  <div class="w-7/12 h-full">
    <ChatPanel />
  </div>
</div>
