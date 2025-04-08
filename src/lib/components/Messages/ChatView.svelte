<script lang="ts">
  export let conversation;
  export let messages;
  export let onBack = () => {};

  // Mock messages (move this to MessagesPage later)
  let newMessage = "";

  function handleSend() {
    if (!newMessage.trim()) return;
    // Handle sending message
    newMessage = "";
  }
</script>

<div class="flex flex-col h-full mt-5 mb-5">
  <!-- Chat Header -->
  <div class="p-4 border-b border-border bg-background-700/50 shadow-md">
    <div class="flex items-center space-x-4">
      <button 
        class="p-2 hover:bg-background-600 rounded-full transition-all duration-200 hover:scale-105"
        on:click={onBack}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="flex items-center space-x-3 flex-1">
        <div class="relative">
          <img 
            src={conversation.user.avatar} 
            alt={conversation.user.name} 
            class="w-12 h-12 rounded-full border-2 border-primary/20"
          />
          <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background-800"></div>
        </div>
        <div>
          <h3 class="font-bold text-primary text-lg">{conversation.user.name}</h3>
          <p class="text-xs text-muted-foreground">{conversation.user.lastSeen}</p>
        </div>
      </div>
      <button class="p-2 hover:bg-background-600 rounded-full transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Messages -->
  <div class="flex-1 overflow-y-auto p-6 space-y-6 bg-background-800/50">
    {#each messages as message}
      <div class="flex {message.isSender ? 'justify-end' : 'justify-start'} items-end space-x-2">
        {#if !message.isSender}
          <img 
            src={conversation.user.avatar} 
            alt={conversation.user.name} 
            class="w-8 h-8 rounded-full mb-2"
          />
        {/if}
        <div 
          class="{message.isSender 
            ? 'bg-primary text-primary-foreground rounded-l-2xl rounded-tr-2xl' 
            : 'bg-background-700 text-primary rounded-r-2xl rounded-tl-2xl'} 
            p-4 max-w-[70%] shadow-md hover:shadow-lg transition-shadow"
        >
          <p class="text-sm">{message.text}</p>
          <span class="text-xs opacity-70 mt-2 block">{message.timestamp}</span>
        </div>
      </div>
    {/each}
  </div>

  <!-- Message Input -->
  <div class="p-4 border-t border-border bg-background-700/50">
    <div class="flex items-center space-x-3">
      <button class="p-2 hover:bg-background-600 rounded-full transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      <input 
        type="text" 
        bind:value={newMessage}
        placeholder="Type a message..." 
        class="flex-1 bg-background-600 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm placeholder:text-muted-foreground/50"
      />
      <button 
        on:click={handleSend}
        class="bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
      >
        <span>Send</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  </div>
</div> 