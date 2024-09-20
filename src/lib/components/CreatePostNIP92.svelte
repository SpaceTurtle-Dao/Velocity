<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { z } from "zod";
  import { Button } from "$lib/components/ui/button";
  import { Image, XCircle, CheckCircle } from "lucide-svelte";
  import { upload } from "$lib/ao/uploader";
  import { Video } from "flowbite-svelte";
  import mime from "mime";
  import NIP92TagHandler from './views/NIP92TagHandler.svelte';

  export let isOpen = false;
  export let parent: string | null = null;

  let content = "";
  let selectedImage: File;
  let imagePreviewUrl: string | null = null;
  let altText = "";
  let isLoading = false;
  let showSuccessMessage = false;
  let error = "";
  let customTags: string = "";

  const dispatch = createEventDispatcher();

  const schema = z.object({
    content: z.string().min(1, "Content is required"),
    parent: z.string().nullable().optional(),
    customTags: z.string().optional(),
  });

  function getExt(name: string) {
    let mimeType = mime.getType(name);
    //@ts-ignore
    return mime.getExtension(mimeType);
  }

  function parseCustomTags(tags: string): string[][] {
    return tags.split(',').map(tag => {
      const [key, ...values] = tag.trim().split(':').map(t => t.trim());
      return [key, ...values];
    }).filter(tag => tag.length > 1);
  }

  async function create_post() {
    try {
      isLoading = true;
      error = "";
      showSuccessMessage = false;

      if (!selectedImage) {
        throw new Error("Please select an image");
      }

      let media = await upload(selectedImage);

      const validatedData = schema.parse({
        content,
        parent,
        customTags,
      });

      const imageUrl = `https://example.com/${media.hash}.${media.ext}`;
      const fullContent = `${validatedData.content} ${imageUrl}`;

      const tags: string[][] = [
        ["imeta", "url", imageUrl],
        ["imeta", "m", mime.getType(selectedImage.name) || ""],
      ];

      if (altText) {
        tags.push(["imeta", "alt", altText]);
      }

      if (validatedData.parent) {
        tags.push(["e", validatedData.parent]);
      }

      //@ts-ignore
      tags.push(...parseCustomTags(validatedData.customTags));

      const event: Event = {
        //@ts-ignore
        content: fullContent,
        kind: 1,
        tags: tags,
        created_at: Math.floor(Date.now() / 1000),
        pubkey: "", // Add your pubkey logic here
        id: "", // Add id generation logic here
      };

      // Here you would typically send this event to your Nostr relay
      console.log("Event to be sent:", event);

      showSuccessMessage = true;
      setTimeout(() => (showSuccessMessage = false), 3000);

      closeModal();
    } catch (e) {
      if (e instanceof z.ZodError) {
        error = e.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
      } else if (e instanceof Error) {
        error = e.message;
      } else {
        error = "An unexpected error occurred";
      }
    } finally {
      isLoading = false;
    }
  }

  function closeModal() {
    dispatch("close");
  }

  function handleImageButtonClick() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*, video/*, audio/*';
    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        selectedImage = target.files[0];
        imagePreviewUrl = URL.createObjectURL(selectedImage);
      }
    };
    fileInput.click();
  }

  function removeSelectedImage() {
    //@ts-ignore
    selectedImage = null;
    imagePreviewUrl = null;
  }

  onMount(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  });
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-1 rounded-2xl w-full max-w-lg shadow-lg">
      <div class="bg-white rounded-xl p-6 space-y-6 overflow-y-auto max-h-[80vh]">
        <div class="flex justify-between items-center">
          <h2 class="text-3xl font-bold text-gray-900">Create Post</h2>
          <Button variant="ghost" on:click={closeModal} class="text-gray-600 hover:text-gray-900">
            <span class="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <form on:submit|preventDefault={create_post} class="space-y-4">
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700">Content:</label>
            <textarea
              id="content"
              bind:value={content}
              required
              class="mt-1 block w-full rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              rows="4"
              placeholder="Enter content"
            ></textarea>
          </div>

          <div>
            <label for="customTags" class="block text-sm font-medium text-gray-700">Custom Tags:</label>
            <input
              id="customTags"
              type="text"
              bind:value={customTags}
              class="mt-1 block w-full rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              placeholder="Enter tags (e.g., tag1:value1, tag2:value2:extra)"
            />
          </div>

          <div>
            <Button on:click={handleImageButtonClick} class="w-full mt-2">
              <Image class="mr-2" />
              Select Image
            </Button>
          </div>

          {#if imagePreviewUrl}
            <div class="relative">
              <img src={imagePreviewUrl} alt="Selected" class="w-full h-auto rounded-lg" />
              <Button on:click={removeSelectedImage} class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
                <XCircle size={20} />
              </Button>
            </div>
          {/if}

          {#if selectedImage}
            <div>
              <label for="altText" class="block text-sm font-medium text-gray-700">Alt Text:</label>
              <input
                id="altText"
                type="text"
                bind:value={altText}
                class="mt-1 block w-full rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                placeholder="Enter alt text for the image"
              />
            </div>
          {/if}

          {#if error}
            <p class="text-red-500 text-sm">{error}</p>
          {/if}

          <Button
            type="submit"
            class="w-full mt-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
            disabled={isLoading}
          >
            {isLoading ? "Creating Post..." : "Create Post"}
          </Button>
        </form>

        {#if selectedImage}
          <NIP92TagHandler event={{tags: [
            ["imeta", "url", imagePreviewUrl || ""],
            ["imeta", "m", selectedImage.type],
            ["imeta", "alt", altText],
            ...parseCustomTags(customTags)
          ]}} />
        {/if}
      </div>
    </div>
  </div>
{/if}

{#if showSuccessMessage}
  <div class="fixed bottom-4 right-4 bg-green-500 text-white rounded-lg shadow-lg p-4 flex items-center space-x-2 z-50">
    <CheckCircle class="w-6 h-6" />
    <span>Post created successfully!</span>
  </div>
{/if}