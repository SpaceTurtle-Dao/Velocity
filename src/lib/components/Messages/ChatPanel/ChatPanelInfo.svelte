<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<div class="h-full flex flex-col justify-center items-center">
  <div class="max-w-[330px] w-auto">
    <h2 class="text-left text-3xl text-primary font-extrabold">
      Select a message
    </h2>
    <p class="text-left text-muted-foreground text-sm mt-3">
      Choose from your existing conversations, start a new one, or just keep
      swimming.
    </p>
    <Button class="primary mt-6 rounded-full">New message</Button>
  </div>
</div>
