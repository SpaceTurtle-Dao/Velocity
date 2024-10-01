<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Image, X } from "lucide-svelte";
  import type { EventRequest } from "$lib/models/Event";
  import { Textarea } from "./ui/textarea";
  import { event, fetchEvents } from "$lib/ao/relay";
  import { upload } from "$lib/ao/uploader";
  import { currentUser, userEvents } from "$lib/stores/profile.store";
  import type { Tag } from "$lib/models/Tag";
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
  } from "lucide-svelte";

  export let relay: string;

  let content = "";
  let fileInput: HTMLInputElement | null = null;
  let selectedMedia: File | null = null;
  let mediaPreviewUrl: string | null = null;
  let isLoading = false;
  let _event: EventRequest;

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch("close");
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

  function wait(milliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  async function handleSubmit() {
    isLoading = true;
    let filters: Array<any> = [];
    let _tags: Array<Tag> = [];
    let filter = {
      kinds: [1],
      since: 1663905355000,
      until: Date.now(),
      limit: 100,
    };
    filters.push(filter);
    let _filters = JSON.stringify(filters);
    let _content = content;
    if (selectedMedia) {
      let media = await upload(selectedMedia);
      let imeta = "imeta";
      let dimisions = ""; //"3024x4032"
      let url = "url " + media.url;
      let m = "m " + media.mimeType;
      let dim = "dim " + dimisions;
      let _tag: Tag = {
        name: "imeta",
        value: JSON.stringify([url, m, dim]),
      };
      let kind: Tag = {
        name: "kind",
        value: "1",
      };
      _tags.push(_tag);
      _tags.push(kind);
      _content = _content + " " + media.url;
    }
    let json = JSON.stringify(_event);
    console.log("///////This is the event to be posted////////");
    console.log(json);
    await event(_tags, _content, relay);
    console.log("///FETCHING EVENTS///");
    fetchEvents($currentUser.Process, _filters);
    isLoading = false;
    closeModal();
  }

  /*onMount(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  });*/
</script>

<Dialog.Root>
  <Dialog.Trigger
    class="w-full h-13 bg-primary text-secondary rounded-full py-3 font-bold text-lg hover:bg-ring transition-colors duration-200 flex items-center justify-center"
  >
    <Plus class="w-5 h-5 mr-2" />
    Post</Dialog.Trigger
  >
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Create Post</Dialog.Title>
    </Dialog.Header>
    <div
      class="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-background rounded-xl p-6 w-full max-w-lg shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            on:click={closeModal}
            size="icon"
            class="text-muted-foreground bg-background  hover:text-foreground rounded-full"
          >
            <X size={24} />
          </Button>
        </div>

        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
          <Textarea
            bind:value={content}
            placeholder="What's happening?!"
            class="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          ></Textarea>

          {#if mediaPreviewUrl}
            <div class="relative">
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
                size="icon"
                class="text-muted-foreground bg-background  hover:text-foreground rounded-full absolute top-2 right-2 p-1"
              >
                <X />
              </Button>
            </div>
          {:else}
            <div class="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                on:click={handleMediaButtonClick}
                class="text-primary hover:bg-primary/10 p-2 rounded-full"
              >
                <Image size={24} />
              </Button>
              <span class="text-sm text-muted-foreground"
                >Add photo or video</span
              >
            </div>
          {/if}

          <input
            type="file"
            accept="image/*, video/*"
            bind:this={fileInput}
            class="hidden"
            on:change={handleFileChange}
          />
        </form>
      </div>
    </div>
    <Dialog.Footer>
      <Button
        type="submit"
        class="w-full py-2 px-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition duration-200"
        disabled={isLoading || (!content && !selectedMedia)}
      >
        {isLoading ? "Posting..." : "Post"}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
