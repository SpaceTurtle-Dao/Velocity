<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { Image, Smile, Calendar, MapPin, X, ChevronDown } from 'lucide-svelte';

  export let isOpen = false;
  let postContent = "";
  let charCount = 0;
  let maxChars = 280;

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }

  function submitPost() {
    if (postContent.trim() && charCount <= maxChars) {
      dispatch('submit', { content: postContent });
      postContent = "";
      closeModal();
    }
  }

  $: charCount = postContent.length;

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
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50" 
       transition:fade={{duration: 200}}
       on:click|self={closeModal}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl w-full max-w-2xl shadow-2xl"
         transition:fly={{y: 50, duration: 300}}
         on:click|stopPropagation>
      <div class="flex justify-between items-center p-6 border-b border-gray-700">
        <button on:click={closeModal} class="text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
        <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">Create Meme</h2>
        <div class="w-6"></div> <!-- Spacer for alignment -->
      </div>
      
      <div class="p-6">
        <div class="flex items-start space-x-4">
          <div class="flex-grow">
            <textarea
              bind:value={postContent}
              placeholder="Post Memes for Pumping and Dumping !!!"
              class="w-full bg-transparent resize-none focus:outline-none text-xl min-h-[120px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
              rows="4"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div class="px-6 pb-4">
        <div class="flex justify-between items-center">
          <div class="flex space-x-4">
            <button class="text-blue-400 hover:bg-blue-900 hover:bg-opacity-20 p-2 rounded-full transition-colors">
              <Image size={24} />
            </button>
            <button class="text-blue-400 hover:bg-blue-900 hover:bg-opacity-20 p-2 rounded-full transition-colors">
              <span class="font-bold">GIF</span>
            </button>
            <button class="text-blue-400 hover:bg-blue-900 hover:bg-opacity-20 p-2 rounded-full transition-colors">
              <Smile size={24} />
            </button>
          </div>
          <div class="flex items-center space-x-4">
            <button
              on:click={submitPost}
              class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}