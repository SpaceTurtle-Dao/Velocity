<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import { event, fetchEvents } from "$lib/ao/relay";
  import { upload } from "$lib/ao/uploader";
  import { currentUser, userEvents } from "$lib/stores/profile.store";
  import type { Tag } from "$lib/models/Tags";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import {
    Home as HomeIcon,
    Search,
    Bell,
    User,
    MoreHorizontal,
    Plus,
    Zap,
    Edit,
    Mail,
    Image,
    X,
  } from "lucide-svelte";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import DialogFooter from "$lib/components/ui/dialog/dialog-footer.svelte";

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
    let _content = content;
    if (selectedMedia) {
      let media = await upload(selectedMedia);
      let dimisions = ""; //"3024x4032"
      let url = "url " + media.url;
      let m = "m " + media.mimeType;
      let dim = "dim " + dimisions;
      let _tag: Tag = {
        name: "imeta",
        value: JSON.stringify([url, m, dim]),
      };
      _content = _content + " " + media.url;
      _tags.push(_tag);
    }

    let contentTag: Tag = {
      name: "Content",
      value: _content,
    };
    _tags.push(contentTag);
    await event(_tags, $currentUser.Process);
    console.log("///FETCHING EVENTS///");
    //fetchEvents($currentUser.Process, _filters);
    isLoading = false;
    dialogOpen = false;
  }

  $: if (dialogOpen === false) {
    clearFields();
  }
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger
    class="w-full h-13 bg-primary text-secondary rounded-full py-3 font-bold text-lg hover:bg-ring transition-colors duration-200 flex items-center justify-center"
  >
    <Plus class="w-5 h-5 mr-2" />
    Post
  </Dialog.Trigger>
  <Dialog.Content class="w-full text-primary border-border">
    <Dialog.Header>
      <Dialog.Title>Create a Post</Dialog.Title>
      <Dialog.Description>Share what's on your mind</Dialog.Description>
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
        <div class="w-full">
          <Textarea
            bind:value={content}
            placeholder="What's happening?!"
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
    <Separator />
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
          disabled={isLoading || (!content && !selectedMedia)}
        >
          {isLoading ? "Posting..." : "Post"}
        </Button>
      </div>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>