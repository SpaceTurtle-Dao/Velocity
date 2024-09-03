<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { z } from 'zod';
  import { meme } from '$lib/ao/mememaker';
  import { Button } from '$lib/components/ui/button';
  import { Image, XCircle, CheckCircle } from 'lucide-svelte';
  import { upload } from '$lib/ao/uploader';

  export let isOpen = false;
  let quantity = '';
  let amount = '';
  let tags = '[]';
  let content = '';
  export let parent: string | null = null;
  let error = '';
  let fileInput: HTMLInputElement | null = null;
  let selectedImage: File | null = null;
  let imagePreviewUrl: string | null = null;
  let isLoading = false;
  let showSuccessMessage = false;

  const dispatch = createEventDispatcher();

  const schema = z.object({
    quantity: z.string().min(1, 'Quantity is required'),
    amount: z.string().min(1, 'Amount is required'),
    tags: z.string().optional(),
    content: z.string().min(1, 'Content is required'),
    parent: z.string().nullable().optional(),
  });

  async function create_meme() {
    try {
      isLoading = true;
      error = '';
      showSuccessMessage = false;

      if (!selectedImage) {
        throw new Error('Please select an image');
      }

      let tx = await upload(await selectedImage.arrayBuffer());

      let jsonContent = {
        media: tx,
        content: content
      };

      const validatedData = schema.parse({
        quantity,
        amount,
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
        validatedData.parent
      );
      console.log("parent:" + validatedData.parent)
      showSuccessMessage = true;
      setTimeout(() => showSuccessMessage = false, 3000);

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
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-1 rounded-2xl w-full max-w-lg shadow-lg">
      <div class="bg-white rounded-xl p-6 space-y-6 overflow-y-auto max-h-[80vh]">
        <div class="flex justify-between items-center">
          <h2 class="text-3xl font-bold text-gray-900">Create Meme</h2>
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
            <input id="quantity" type="text" bind:value={quantity} required 
              class="mt-1 block w-full rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-500" 
              placeholder="Enter quantity" />
          </div>

          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700">Amount:</label>
            <input id="amount" type="text" bind:value={amount} required 
              class="mt-1 block w-full rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-500" 
              placeholder="Enter amount" />
          </div>

          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700">Tags:</label>
            <input id="tags" type="text" bind:value={tags} 
              class="mt-1 block w-full rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-500" 
              placeholder="Enter tags" />
          </div>

          <div>
            <label for="content" class="block text-sm font-medium text-gray-700">Content:</label>
            <textarea id="content" bind:value={content} required 
              class="mt-1 block w-full rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-500" 
              rows="4" placeholder="Enter content"></textarea>
          </div>

          {#if imagePreviewUrl}
            <div class="relative">
              <!-- svelte-ignore a11y-img-redundant-alt -->
              <img src={imagePreviewUrl} alt="Selected Image" class="w-full h-48 object-cover rounded-md shadow-md" />
              <Button type="button" variant="ghost" on:click={removeSelectedImage} 
                class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                <XCircle size={20} />
                <span class="sr-only">Remove Image</span>
              </Button>
            </div>
          {:else}
            <div class="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
              <Button variant="ghost" on:click={handleImageButtonClick} 
                class="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full">
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
            <p class="text-red-500 text-sm">{error}</p>
          {/if}

          <Button type="submit" class="w-full mt-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700" disabled={isLoading}>
            {isLoading ? 'Creating Meme...' : 'Create Meme'}
          </Button>
        </form>
      </div>
    </div>
  </div>
{/if}

{#if showSuccessMessage}
  <div class="fixed bottom-4 right-4 bg-green-500 text-white rounded-lg shadow-lg p-4 flex items-center space-x-2 z-50">
    <CheckCircle class="w-6 h-6" />
    <span>Meme created successfully!</span>
  </div>
{/if}
