<script lang="ts">
  import { onMount } from "svelte";
  import ChatPanelInfo from "$lib/components/Messages/ChatPanel/ChatPanelInfo.svelte";
  import ProfilePictureHoverCard from "../UserProfile/ProfilePictureHoverCard.svelte";
  import Message from "./ChatMessage/Message.svelte";

  let isMessageSelected = true;

  let avatarUrl = "https://github.com/shadcn.png";
  let name: string = "This is Shad";
  let username: string = "@shadcn";
  let about: string =
    "Community Manager @XYZ_DAPPS | Bridging Web3 communities through education & engagement 🌐 |";

  let isSubscribed = true;

  let website = "https://www.google.co.in/";

  let subscribers = 0;
  let subscribing = 0;
  let processId = "bV_WGUT_RbkeVeakTrYqn0oCNXICktI8MyDO93jQNzc";

  type Message = {
    id: string;
    type: "sent" | "received";
    content: string;
    timestamp: number;
  };

  let messages: Message[] = [
    {
      id: "1",
      type: "received",
      content:
        "Remember that project we started last month? The client loved our proposal!",
      timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000, // 1 month ago
    },
    {
      id: "2",
      type: "sent",
      content:
        "That's fantastic news! All our hard work paid off. What's the next step?",
      timestamp: Date.now() - 29 * 24 * 60 * 60 * 1000, // 29 days ago
    },
    {
      id: "3",
      type: "received",
      content:
        "They want to schedule a meeting to discuss the implementation timeline. How's next Tuesday for you?",
      timestamp: Date.now() - 21 * 24 * 60 * 60 * 1000, // 3 weeks ago
    },
    {
      id: "4",
      type: "sent",
      content:
        "Tuesday works perfectly. Let's set it up and prepare a preliminary timeline.",
      timestamp: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
    },
    {
      id: "5",
      type: "received",
      content:
        "Great! I've sent out the meeting invite. Don't forget about the conference next week as well.",
      timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000, // 2 weeks ago
    },
    {
      id: "6",
      type: "sent",
      content:
        "Thanks for the reminder. I'm looking forward to it. Any specific sessions you recommend?",
      timestamp: Date.now() - 13 * 24 * 60 * 60 * 1000, // 13 days ago
    },
    {
      id: "7",
      type: "received",
      content:
        "The AI in Web Development talk looks interesting. Also, don't miss the networking event on day two!",
      timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
    },
    {
      id: "8",
      type: "sent",
      content:
        "Noted! I'll make sure to attend both. See you at the conference!",
      timestamp: Date.now() - 9 * 24 * 60 * 60 * 1000, // 9 days ago
    },
    {
      id: "9",
      type: "received",
      content: "Hey, how was the conference? Did you enjoy the AI talk?",
      timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000, // 6 days ago
    },
    {
      id: "10",
      type: "sent",
      content:
        "It was amazing! The AI talk gave me some great ideas for our current project. How about we discuss them tomorrow?",
      timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    },
    {
      id: "11",
      type: "received",
      content:
        "Absolutely! Let's meet for coffee and go over your ideas. 10 AM at the usual place?",
      timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4 days ago
    },
    {
      id: "12",
      type: "sent",
      content: "Perfect, see you there!",
      timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000, // 4 days ago + 1 hour
    },
    {
      id: "13",
      type: "received",
      content:
        "Great meeting yesterday! I've updated the project plan with your suggestions.",
      timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    },
    {
      id: "14",
      type: "sent",
      content:
        "Excellent! I'll review it today and get back to you with any final thoughts.",
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    },
    {
      id: "15",
      type: "received",
      content:
        "Sounds good. By the way, have you heard about the new software update?",
      timestamp: Date.now() - 24 * 60 * 60 * 1000, // Yesterday
    },
    {
      id: "16",
      type: "sent",
      content: "No, I haven't. What's new in this update?",
      timestamp: Date.now() - 23 * 60 * 60 * 1000, // 23 hours ago
    },
    {
      id: "17",
      type: "received",
      content:
        "It includes some major performance improvements and new features. I'll send you the details shortly.",
      timestamp: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
    },
    {
      id: "18",
      type: "sent",
      content:
        "That sounds great! I'm looking forward to checking it out. Thanks for keeping me in the loop.",
      timestamp: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
    },
    {
      id: "19",
      type: "received",
      content:
        "Always happy to help! Let me know if you need any assistance with the update.",
      timestamp: Date.now() - 60 * 60 * 1000, // 1 hour ago
    },
    {
      id: "20",
      type: "sent",
      content: "Will do, thanks! I'll start the update process now.",
      timestamp: Date.now() - 30 * 60 * 1000, // 30 minutes ago
    },
  ];

  let chatContainer: HTMLElement;

  // Custom action to scroll to bottom
  function scrollToBottom(node: HTMLElement) {
    const scroll = () => {
      node.scrollTop = node.scrollHeight;
    };
    scroll(); // Initial scroll
    return {
      update: scroll, // Scroll on updates
    };
  }

  onMount(() => {
    // Ensure scroll to bottom on initial load
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });
</script>

<div class="border-r border-border h-full">
  {#if isMessageSelected}
    <div
      class="flex justify-start items-center p-3.5 w-full border-b border-border"
    >
      <ProfilePictureHoverCard
        image={avatarUrl}
        {name}
        {username}
        {about}
        {isSubscribed}
        {website}
        {subscribers}
        {subscribing}
        {processId}
      />
      <div class="text-primary text-lg font-bold ml-2">
        {name}
      </div>
    </div>

    <div class="flex flex-col h-[calc(100vh-4.5rem)]">
      <div
        bind:this={chatContainer}
        use:scrollToBottom
        class="flex-grow p-4 space-y-4 overflow-y-auto scrollable-element"
      >
        {#each messages as message (message.id)}
          <Message {message} />
        {/each}
      </div>

      <div class="p-4 border-t border-border">
        <div class="flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            class="flex-grow p-2 rounded-l-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button class="bg-primary text-primary-foreground p-2 rounded-r-md">
            Send
          </button>
        </div>
      </div>
    </div>
  {:else}
    <ChatPanelInfo />
  {/if}
</div>

<style>
  .scrollable-element {
    scrollbar-color: hsl(0, 0%, 45%) hsl(0 0% 14.9%);
    scrollbar-width: thin;
  }
</style>
