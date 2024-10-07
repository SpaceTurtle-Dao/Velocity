<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Image, Smile, Calendar } from 'lucide-svelte';
  import * as Dialog from "$lib/components/ui/dialog";
  import Nip92 from "$lib/handlers/NIP92.svelte";
  import { Separator } from "$lib/components/ui/separator/index";

  export let isOpen = false;
  export let originalPost: { author: string, content: string, avatar: string, event: any };
  export let currentUser: { name: string, avatar: string };

  let replyText = '';

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }

  function handleSubmit() {
    dispatch('submit', replyText);
    replyText = '';
    closeModal();
  }

  $: if (!isOpen) {
    replyText = '';
  }
</script>

<Dialog.Root bind:open={isOpen} onOpenChange={closeModal}>
  <Dialog.Content class="sm:max-w-[500px] max-h-[80vh] overflow-y-auto rounded-lg border-border">
    <Dialog.Header>
        <Dialog.Title class='text-white'>Reply</Dialog.Title>
    </Dialog.Header>
    <div class="p-4">
        <div class="flex space-x-3 text-white">
        <Avatar.Root class="h-10 w-10 flex-shrink-0">
            <Avatar.Image src={originalPost.avatar} alt={originalPost.author} />
            <Separator orientation="vertical" />
            <Avatar.Fallback>{originalPost.author[0]}</Avatar.Fallback>
        </Avatar.Root>
        <div class="flex-grow overflow-hidden">
            <p class="font-semibold">{originalPost.author}</p>
            <div>
            <Nip92 event={originalPost.event} />
            </div>
        </div>
    </div>

      <div class="mt-4 flex space-x-3">
        <Avatar.Root class="h-10 w-10 flex-shrink-0">
          <Avatar.Image src={currentUser.avatar} alt={currentUser.name} />
          <Avatar.Fallback>{currentUser.name[0]}</Avatar.Fallback>
        </Avatar.Root>
        <div class="flex-grow">
          <Input
            type="text"
            placeholder="Post your reply"
            bind:value={replyText}
            class="w-full"
          />
        </div>
      </div>

      <div class="mt-4 flex justify-between items-center">
        <div class="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Image class="h-4 w-4 text-primary" />
          </Button>
          <Button variant="ghost" size="icon">
            <Smile class="h-4 w-4 text-primary" />
          </Button>
          <Button variant="ghost" size="icon">
            <Calendar class="h-4 w-4 text-primary" />
          </Button>
        </div>
        <Button on:click={handleSubmit} disabled={!replyText.trim()}>
          Reply
        </Button>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>