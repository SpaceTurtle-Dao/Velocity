<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import { event as aoEvent, fetchEvents } from "$lib/ao/relay";
  import { currentUser } from "$lib/stores/profile.store";
  import type { Tag } from "$lib/models/Tag";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Image, X } from "lucide-svelte";
  import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";

  export let event: any;
  export let user: any;
  let newReply: any;

  let content = "";
  let fileInput: HTMLInputElement | null = null;
  let selectedMedia: File | null = null;
  let mediaPreviewUrl: string | null = null;
  let isLoading = false;
  let dialogOpen = false;

  const dispatch = createEventDispatcher();

  function clearFields() {
    content = "";
    selectedMedia = null;
    mediaPreviewUrl = null;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  function handleMediaButtonClick() {
    if (fileInput) {
      fileInput.click();
    }
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      selectedMedia = target.files[0];
      mediaPreviewUrl = URL.createObjectURL(selectedMedia);
    }
  }

  function removeSelectedMedia() {
    selectedMedia = null;
    mediaPreviewUrl = null;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  async function handleSubmit() {
    isLoading = true;
    let kind: Tag = {
      name: "Kind",
      value: "1",
    };
    let _tags: Array<Tag> = [kind];

    // Add reply-specific tags
    let eTag: Tag = {
      name: "e",
      value: event.Id,
    };
    let pTag: Tag = {
      name: "p",
      value: event.From,
    };
    let markerTag: Tag = {
      name: "marker",
      value: "reply",
    };
    _tags.push(eTag, pTag, markerTag);

    let _content = content;
    if (selectedMedia) {
      // Handle media upload here if needed
      _content = _content + " [Media attached]"; // Placeholder for media handling
    }

    let contentTag: Tag = {
      name: "Content",
      value: _content,
    };
    _tags.push(contentTag);

    if(event.marker)
    {
      newReply = await aoEvent(_tags, event.From);
    }
    else{
      newReply = await aoEvent(_tags, event.p);
    }

    
    
    // Dispatch an event to notify the parent component of the new reply
    dispatch('newReply', newReply);

    isLoading = false;
    dialogOpen = false;
    clearFields();
  }

  $: if (dialogOpen === false) {
    clearFields();
  }
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger>
    <Button
      variant="ghost"
      size="icon"
      class="flex flex-row text-primary space-x-1 bg-transparent hover:bg-transparent"
    >
      <span class="sr-only">Reply</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
    </Button>
  </Dialog.Trigger>
  <Dialog.Content class="w-full text-primary border-border">
    <Dialog.Header>
      <Dialog.Title>Reply to Post</Dialog.Title>
      <Dialog.Description>Respond to {user.Profile.name}'s post</Dialog.Description>
    </Dialog.Header>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="flex">
        {#if $currentUser.Profile.picture}
          <Avatar class="h-12 w-12">
            <AvatarImage
              src={$currentUser.Profile.picture}
              alt={$currentUser.Profile.name}
            />
            <AvatarFallback>{$currentUser.Profile.name}</AvatarFallback>
          </Avatar>
        {:else}
          <Avatar class="h-12 w-12">
            <AvatarFallback>{$currentUser.Profile.name}</AvatarFallback>
          </Avatar>
        {/if}
        <div class="w-full ml-3">
          <Textarea
            bind:value={content}
            placeholder="Post your reply"
            class="text-lg w-full bg-background border-none focus:border-none outline-none focus:outline-none focus-visible:outline-none ring-none focus:ring-none focus-visible:ring-none ring-background overflow-y-hidden"
          ></Textarea>
          {#if mediaPreviewUrl}
            <div class="relative p-5">
              {#if selectedMedia && selectedMedia.type.startsWith("video")}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video
                  src={mediaPreviewUrl}
                  controls
                  class="w-full h-48 object-cover rounded-md"
                ></video>
              {:else}
                <img
                  src={mediaPreviewUrl}
                  alt="Selected media"
                  class="w-full object-cover rounded-md"
                />
              {/if}
              <Button
                variant="ghost"
                on:click={removeSelectedMedia}
                class="text-muted-primary bg-muted-foreground h-18 w-18 hover:text-foreground rounded-full absolute top-2 right-2 p-1"
              >
                <X />
              </Button>
            </div>
          {/if}
        </div>
      </div>
      <input
        type="file"
        accept="image/*, video/*"
        bind:this={fileInput}
        class="hidden"
        on:change={handleFileChange}
      />
    </form>
    <Dialog.Footer>
      <div class="w-full flex flex-row justify-between">
        <Button
          type="button"
          variant="ghost"
          on:click={handleMediaButtonClick}
          class="text-primary hover:bg-primary/10 rounded-full"
        >
          <Image size={24} />
        </Button>
        <Button
          type="submit"
          on:click={handleSubmit}
          class="bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition duration-200 text-md"
          disabled={isLoading || !content.trim()}
        >
          {isLoading ? "Replying..." : "Reply"}
        </Button>
      </div>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>