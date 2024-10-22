<script lang="ts">
    import Reply from '$lib/components/views/engagement/Reply.svelte';
    import { onMount } from 'svelte';
    import { info } from "$lib/ao/relay";
    import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/ui/avatar";
    import { CornerDownRight } from "lucide-svelte";
    import Nip92 from "$lib/handlers/NIP92.svelte";
    import Like from '$lib/components/views/engagement/Like.svelte';
    import Repost from '$lib/components/views/engagement/Repost.svelte';
    import Buy from '$lib/components/views/engagement/Buy.svelte';
    import Share from '$lib/components/views/engagement/Share.svelte';
    import { createEventDispatcher } from 'svelte';
  import { currentUser } from '$lib/stores/profile.store';

    export let event: any;
    export let replies: any[] = [];
    
    let _user: any;
    let profile: any;
    let isReply: boolean = false;
    let replyingTo: string | null = null;
    let isRepost: boolean = false;
    let originalEvent: any = null;
    let originalUser: any = null;
    let originalProfile: any = null;
    
    const dispatch = createEventDispatcher();

    onMount(async () => {
        _user = await info(event.From);
        profile = _user?.Profile;

        if (event.Tags["marker"] === "reply") {
            isReply = true;
            replyingTo = event.Tags["p"];
        }

        if (event.Tags['Kind'] === '6') {
            isRepost = true;
            try {
                originalEvent = JSON.parse(event.Tags['Content']);
                originalUser = await info(originalEvent.From);
                originalProfile = originalUser?.Profile;
            } catch (error) {
                console.error('Failed to handle repost:', error);
                isRepost = false;
            }
        }
    });

    function handleNewReply(replyEvent: any) {
        replies = [...replies, replyEvent.detail];
        dispatch('newReply', replyEvent.detail);
    }
</script>

<div class="pl-5 pt-5 pr-5 {isReply ? 'ml-8 border-l-2 border-gray-300' : ''}">
    <!-- Reply Information -->
    {#if isReply}
        <div class="flex items-center text-gray-500 mb-2">
            <CornerDownRight size={16} class="mr-2" />
            <span class="text-sm">Replying to @{replyingTo}</span>
        </div>
    {/if}

    <!-- Repost Banner -->
    {#if isRepost && profile?.name}
        <div class="flex items-center text-gray-500 mb-2">
            <span class="text-sm">Reposted by 
               {#if profile?.name == $currentUser?.Profile?.name}
                    You
                {:else}
                @{profile.name}
                {/if}
            </span>
            
        </div>
    {/if}

    <!-- Main Content -->
    <div>
        <div class="flex justify-start space-x-2">
            <Avatar class="hidden h-9 w-9 sm:flex">
                {#if isRepost && originalProfile?.picture}
                    <AvatarImage src={originalProfile.picture} alt="Avatar" />
                {:else if profile?.picture}
                    <AvatarImage src={profile.picture} alt="Avatar" />
                {:else}
                    <AvatarFallback>
                        {#if isRepost}
                            {originalProfile?.name?.[0] || 'U'}
                        {:else}
                            {profile?.name?.[0] || 'U'}
                        {/if}
                    </AvatarFallback>
                {/if}
            </Avatar>
            
            <div>
                <div class="flex space-x-1">
                    <p class="font-medium text-primary h-5">
                        {#if isRepost && originalProfile?.name}
                            {originalProfile.name}
                        {:else}
                            {profile?.name}
                        {/if}
                    </p>
                </div>

                <!-- Content Display -->
                {#if isRepost && originalEvent}
                    <Nip92 event={originalEvent} />
                {:else}
                    <Nip92 {event} />
                {/if}
            </div>
        </div>

        <!-- Engagement Buttons -->
        <div class="flex justify-between py-2 px-10">
            <Reply {event} user={_user} on:newReply={handleNewReply}/>
            <Repost _event={isRepost ? originalEvent : event}/>
            <Like _event={isRepost ? originalEvent : event}/>
            <Buy />
            <Share />
        </div>
    </div>

    <!-- Nested Replies -->
    {#if replies.length > 0}
        <div class="ml-8 mt-4">
            {#each replies as reply}
                <svelte:self event={reply} replies={reply.replies || []} on:newReply />
            {/each}
        </div>
    {/if}
</div>