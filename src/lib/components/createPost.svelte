<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { CreatePostData } from "./types/feed";

  let content = "";
  let mediaFile: File | null = null;

  const dispatch = createEventDispatcher<{ createPost: CreatePostData }>();

  function handleSubmit(): void {
    if (content.trim() || mediaFile) {
      dispatch("createPost", { content, mediaFile });
      content = "";
      mediaFile = null;
    }
  }

  function handleFileInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      mediaFile = target.files[0];
    }
  }
</script>

<div class="bg-secondary rounded-lg shadow-md p-4 mb-4">
  <textarea
    bind:value={content}
    placeholder="What's on your mind?"
    class="w-full p-2 mb-2 border bg-secondary border-gray-500 rounded-md resize-none focus:outline-none focus:ring-3 focus:ring-secondary"
    rows="3"
  ></textarea>
  <div class="flex justify-between items-center">
    <label
      class="cursor-pointer bg-gray-500 hover:bg-gray-300 text-white focus:text-white font-bold py-1 px-2 rounded inline-flex items-center"
    >
      <svg
        class="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        ></path>
      </svg>
      <input
        type="file"
        class="hidden"
        on:change={handleFileInput}
        accept="image/*,video/*"
      />
    </label>
    <button
      on:click={handleSubmit}
      class="bg-call-500 hover:bg-call-700 text-white py-2 px-4 rounded"
    >
      Post
    </button>
  </div>
  {#if mediaFile}
    <div class="mt-2 text-sm text-gray-600">
      Selected file: {mediaFile.name}
    </div>
  {/if}
</div>
