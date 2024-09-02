<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { z } from 'zod';
  import { JSONEditor } from 'svelte-jsoneditor';
  import { meme } from '$lib/ao/mememaker';
  import { Button } from '$lib/components/ui/ui/button';
  import { Image, XCircle } from 'lucide-svelte';
  import { upload } from '$lib/ao/uploader';

  export let isOpen = false;
  let quantity = '';
  let amount = '';
  let kind = '0';
  let tags = '[]';
  let content = '';
  let parent: string | null = null;
  let jsonContent = {};
  let error = '';
  let fileInput: HTMLInputElement | null = null;
  let selectedImage: File | null = null;
  let imagePreviewUrl: string | null = null;
  let isLoading = false;

  const dispatch = createEventDispatcher();

  const schema = z.object({
    quantity: z.string().min(1, 'Quantity is required'),
    amount: z.string().min(1, 'Amount is required'),
    kind: z.enum(['0', '1']),
    tags: z.string().optional(),
    content: z.string().min(1, 'Content is required'),
    parent: z.string().nullable().optional(),
  });

  async function create_meme() {
    try {
      isLoading = true;
      error = '';

      if (!selectedImage) {
        throw new Error('Please select an image');
      }

      let tx = await upload(await selectedImage.arrayBuffer());

      let jsonContent = {
        media:tx,
        content:content
      }

      const validatedData = schema.parse({
        quantity,
        amount,
        kind,
        tags,
        content: JSON.stringify(jsonContent),
        parent,
      });

      await meme(
        validatedData.quantity,
        validatedData.amount,
        "0",
        validatedData.tags || '[]',
        validatedData.content,
        null
      );

      closeModal();
    } catch (e) {
      if (e instanceof z.ZodError) {
        error = e.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      } else if (e instanceof Error) {
        error = e.message;
      } else {
        error = 'An unexpected error occurred';
      }
    } finally {
      isLoading = false;
    }
  }

  function closeModal() {
    dispatch('close');
  }

  function handleJsonChange(event: CustomEvent) {
    jsonContent = event.detail.json;
  }

  function handleImageButtonClick() {
    if (fileInput) {
      fileInput.click();
    }
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      selectedImage = target.files[0];
      imagePreviewUrl = URL.createObjectURL(selectedImage);
    }
  }

  function removeSelectedImage() {
    selectedImage = null;
    imagePreviewUrl = null;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onMount(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  });
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl w-full max-w-lg shadow-lg p-6 space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-semibold text-gray-900">Create Meme</h2>
        <Button variant="ghost" on:click={closeModal} class="text-gray-600 hover:text-gray-900">
          <span class="sr-only">Close</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>

      <form on:submit|preventDefault={create_meme} class="space-y-4">
        <div>
          <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity:</label>
          <input id="quantity" type="text" bind:value={quantity} required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>

        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700">Amount:</label>
          <input id="amount" type="text" bind:value={amount} required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>

        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700">Tags:</label>
          <input id="tags" type="text" bind:value={tags} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>

        <div>
          <label for="content" class="block text-sm font-medium text-gray-700">Content:</label>
          <textarea id="content" bind:value={content} required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows="4"></textarea>
        </div>

        <!-- Image Preview and File Upload -->
        {#if imagePreviewUrl}
          <div class="relative">
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img src={imagePreviewUrl} alt="Selected Image" class="w-full h-auto rounded-md shadow-md" />
            <Button type="button" variant="ghost" on:click={removeSelectedImage} class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
              <XCircle size={20} />
              <span class="sr-only">Remove Image</span>
            </Button>
          </div>
        {:else}
          <div class="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-4">
            <Button variant="ghost" on:click={handleImageButtonClick} class="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full">
              <Image size={24} />
              <span class="sr-only">Upload Image</span>
            </Button>
            <input
              type="file"
              accept="image/*"
              bind:this={fileInput}
              class="hidden"
              on:change={handleFileChange}
            />
          </div>
        {/if}

        {#if error}
          <p class="text-red-500">{error}</p>
        {/if}

        <Button type="submit" class="w-full mt-4" disabled={isLoading}>
          {isLoading ? 'Creating Meme...' : 'Create Meme'}
        </Button>
      </form>
    </div>
  </div>
{/if}