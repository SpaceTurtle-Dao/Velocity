<script lang="ts">
  import { isMobile } from "$lib/stores/is-mobile.store";
  import ChatView from "./ChatView.svelte";

  const conversations = [
    {
      id: 1,
      user: {
        name: "AllIdoIdCode",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        lastSeen: "2 min ago"
      },
      lastMessage: {
        text: "Hey, how's the project going?",
        timestamp: "10:30 AM",
        unread: true
      }
    },
    {
      id: 2,
      user: {
        name: "Nickk",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        lastSeen: "1 hour ago"
      },
      lastMessage: {
        text: "Thanks for the update!",
        timestamp: "9:45 AM",
        unread: false
      }
    },

    {
      id: 3,
      user: {
        name: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        lastSeen: "1 hour ago"
      },
      lastMessage: {
        text: "I'm good, thanks for asking!",
        timestamp: "10:30 AM",
        unread: true
      }
    },
    // Add more mock conversations as needed
  ];

  // Mock chat messages
  const messages = [
    {
      id: 1,
      sender: "Alice Johnson",
      text: "Hey, how's the project going?",
      timestamp: "10:30 AM",
      isSender: false
    },
    {
      id: 2,
      sender: "You",
      text: "It's going well! I'm working on the messaging UI right now.",
      timestamp: "10:31 AM",
      isSender: true
    },
    {
      id: 3,
      sender: "Alice Johnson",
      text: "That sounds great! Can't wait to see it.",
      timestamp: "10:32 AM",
      isSender: false
    }
  ];

  let selectedConversation: any = null;
  let showChat = false;

  function handleConversationClick(conversation: any) {
    selectedConversation = conversation;
    showChat = true;
  }

  function handleBack() {
    showChat = false;
    selectedConversation = null;
  }
</script>

{#if !showChat}
  <!-- Inbox Panel -->
  <div class="w-full bg-background-800 shadow-lg">
    <div class="p-6 border-b border-border bg-background-700/50">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-primary">Messages</h2>
        <button class="p-2 hover:bg-background-600 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
    <div class="overflow-y-auto h-[calc(100vh-120px)]">
      {#each conversations as conversation}
        <div 
          class="p-4 hover:bg-background-700 cursor-pointer transition-all duration-200 border-b border-border/50 relative group"
          on:click={() => handleConversationClick(conversation)}
        >
          <div class="flex items-center space-x-4 p-2">
            <div class="relative">
              <img 
                src={conversation.user.avatar} 
                alt={conversation.user.name} 
                class="w-14 h-14 rounded-full border-2 border-primary/20 hover:border-primary transition-colors"
              />
              {#if conversation.lastMessage.unread}
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full"></div>
              {/if}
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-center mb-1">
                <h3 class="font-semibold text-primary text-lg group-hover:text-primary/90">
                  {conversation.user.name}
                </h3>
                <span class="text-xs text-muted-foreground bg-background-600 px-2 py-1 rounded-full">
                  {conversation.lastMessage.timestamp}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <p class="text-sm text-muted-foreground truncate pr-4">
                  {conversation.lastMessage.text}
                </p>
                <span class="text-xs text-muted-foreground">
                  {conversation.user.lastSeen}
                </span>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
{:else}
  <div class="w-full h-full bg-background-800">
    <ChatView 
      conversation={selectedConversation} 
      {messages}
      onBack={handleBack}
    />
  </div>
{/if}