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
    import { link } from 'svelte-spa-router';
    import * as Dialog from "$lib/components/ui/dialog";

    export let event: any;
    export let replies: any[] = [];
    export let showFullPost: boolean = false;
    let _user: any;
    let profile: any;
    let isReply: boolean = false;
    let replyingTo: string | null = null;
    let dialogOpen = false;

    const dispatch = createEventDispatcher();

    onMount(async () => {
        _user = await info(event.From);
        profile = _user.Profile;
        
        if (event.Tags["marker"] === "reply") {
            isReply = true;
            replyingTo = event.Tags["p"];
        }
    });

    function handleNewReply(replyEvent: any) {
        replies = [...replies, replyEvent.detail];
        dispatch('newReply', replyEvent.detail);
    }

    function handleClick(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (!target.closest('.engagement-buttons')) {
            dialogOpen = true;
        }
    }
</script>

<div on:click={handleClick} class="cursor-pointer">
    <Dialog.Root>
        <Dialog.Trigger asChild>
            <div class={`pl-5 pt-5 pr-5 ${showFullPost ? 'border-b border-gray-200 pb-5' : ''}`}>
                {#if isReply}
                    <div class="flex items-center text-gray-500 mb-2">
                        <CornerDownRight size={16} class="mr-2" />
                        <span class="text-sm">Replying to @{replyingTo}</span>
                    </div>
                {/if}
                <a use:link href={`/post/${event.From}/${event.Id}`}>
                <div>
                    <div class="flex justify-start space-x-2">
                        <Avatar class="hidden h-9 w-9 sm:flex">
                            {#if profile?.picture}
                                <AvatarImage src={profile.picture} alt="Avatar" />
                            {:else}
                                <AvatarFallback>{profile?.name?.[0] || 'U'}</AvatarFallback>
                            {/if}
                        </Avatar>
                        <div>
                            <div class="flex space-x-1">
                                <p class="font-medium text-primary h-5">
                                    {profile?.name}
                                </p>
                            </div>
                            <Nip92 {event} />
                        </div>
                    </div>
                </a>
                    <div class="flex justify-between py-2 px-10 engagement-buttons">
                        <Reply {event} user={_user} on:newReply={handleNewReply}/>
                        <Repost />
                        <Like _event={event}/>
                        <Buy />
                        <Share />
                    </div>
                </div>
            </Dialog.Trigger>
    </Dialog.Root>
</div>
