<script lang="ts">
    import Reply from '$lib/components/views/engagement/Reply.svelte';
    import { onMount } from 'svelte';
    import { fetchEvents, info } from "$lib/ao/relay";
    import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/ui/avatar";
    import { CornerDownRight, Repeat2Icon } from "lucide-svelte";
    import Nip92 from "$lib/handlers/NIP92.svelte";
    import Like from '$lib/components/views/engagement/Like.svelte';
    import Repost from '$lib/components/views/engagement/Repost.svelte';
    import Buy from '$lib/components/views/engagement/Buy.svelte';
    import Share from '$lib/components/views/engagement/Share.svelte';
    import { createEventDispatcher } from 'svelte';
    import { currentUser } from '$lib/stores/profile.store';
    import { link } from 'svelte-spa-router';
    import * as Dialog from "$lib/components/ui/dialog";

    export let event: any;
    export let replies: any[] = [];
    export let showFullPost: boolean = false;
    
    let _user: any;
    let profile: any;
    let isReply: boolean = false;
    let replyingTo: string | null = null;
    let isRepost: boolean = false;
    let originalEvent: any = null;
    let originalUser: any = null;
    let originalProfile: any = null;
    let isLoading: boolean = true;
    let loadError: string | null = null;
    let repostArray: any[] = [];
    let dialogOpen = false;

    $: {
        if (event) {
            loadEventData();
        }
    }

    async function parseRepostContent() {
        if (!event?.Tags?.['Content']) return null;
        
        try {
            const parsed = JSON.parse(event.Tags['Content']);
            if (!parsed || !parsed.From) {
                console.error('Invalid repost content structure');
                return null;
            }
            return parsed;
        } catch (error) {
            console.error('Failed to parse repost content:', error);
            return null;
        }
    }

    async function countReposts() {
        let repostFilter = JSON.stringify([
            {
                kinds: ["6"],
                tags: { e: originalEvent.Id.toString() },
            },
        ]);
        repostArray = await fetchEvents($currentUser.Process, repostFilter);
        console.log("reposts array", repostArray);
    }

    async function loadEventData() {
        isLoading = true;
        loadError = null;
        
        try {
            // Reset state
            isRepost = false;
            originalEvent = null;
            originalUser = null;
            originalProfile = null;

            // Load base user info
            _user = await info(event.From);
            profile = _user?.Profile;

            // Check for reply
            if (event.Tags["marker"] === "reply") {
                isReply = true;
                replyingTo = event.Tags["p"];
            }

            // Check for repost
            if (event.Tags['Kind'] === '6') {
                const parsedContent = await parseRepostContent();
                if (parsedContent) {
                    isRepost = true;
                    originalEvent = parsedContent;
                    
                    // Load original post author info
                    originalUser = await info(parsedContent.From);
                    if (originalUser?.Profile) {
                        originalProfile = originalUser.Profile;
                    } else {
                        console.warn('Original user profile not found');
                    }
                }
            }
        } catch (error) {
            console.error('Error loading event data:', error);
            loadError = 'Failed to load post data';
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        if (event) {
            loadEventData();
        }
    });

    const dispatch = createEventDispatcher();

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

<div class="cursor-pointer border-b border-gray-800">
    <Dialog.Root>
        <Dialog.Trigger asChild>
            {#if isLoading}
                <div class="p-4">
                    <div>
                        <div class="flex items-center text-gray-500 mb-2">
                            <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                        </div>

                        <div>
                            <div class="flex justify-start space-x-2">
                                <div class="hidden sm:block h-9 w-9 rounded-full bg-gray-200 animate-pulse"></div>
                                
                                <div class="flex-1">
                                    <div class="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                                    <div class="space-y-2">
                                        <div class="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                        <div class="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                        <div class="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-between py-4">
                                {#each Array(5) as _}
                                    <div class="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {:else if loadError}
                <div class="p-4 text-red-500">
                    {loadError}
                </div>
            {:else}
                <div class="p-4">
                    {#if isReply}
                        <div class="flex items-center text-gray-500 mb-2">
                            <CornerDownRight size={16} class="mr-2" />
                            <span class="text-sm">Replying to @{replyingTo}</span>
                        </div>
                    {/if}

                    {#if isRepost && profile?.name}
                        <div class="flex items-center text-gray-500 mb-2">
                            <Repeat2Icon size={16} class="mr-2" />
                            <span class="text-sm">Reposted by 
                               {#if profile?.name == $currentUser?.Profile?.name}
                                    You
                                {:else}
                                    @{profile.name}
                                {/if}
                            </span>
                        </div>
                    {/if}

                    <a use:link href={`/post/${event.From}/${event.Id}`}>
                        <div>
                            <div class="flex justify-start space-x-3">
                                <Avatar class="hidden h-10 w-10 sm:flex">
                                    {#if isRepost && originalProfile?.picture}
                                        <AvatarImage src={originalProfile.picture} alt="Avatar" />
                                    {:else if profile?.picture}
                                        <AvatarImage src={profile.picture} alt="Avatar" />
                                    {:else}
                                        <AvatarFallback>
                                            {#if isRepost && originalProfile?.name}
                                                {originalProfile.name[0]}
                                            {:else if profile?.name}
                                                {profile.name[0]}
                                            {:else}
                                                U
                                            {/if}
                                        </AvatarFallback>
                                    {/if}
                                </Avatar>
                                
                                <div class="flex-1">
                                    <div class="flex space-x-1 mb-1">
                                        <p class="font-medium text-primary">
                                            {#if isRepost && originalProfile?.name}
                                                {originalProfile.name}
                                            {:else if profile?.name}
                                                {profile.name}
                                            {:else}
                                                Unknown User
                                            {/if}
                                        </p>
                                    </div>

                                    <!-- Content Display -->
                                    <div class="text-gray-200">
                                        {#if isRepost && originalEvent}
                                            <Nip92 event={originalEvent} />
                                        {:else}
                                            <Nip92 {event} />
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>

                    <div class="flex justify-between mt-3 engagement-buttons">
                        <Reply {event} user={_user} on:newReply={handleNewReply}/>
                        <Repost _event={isRepost ? originalEvent : event}/>
                        <Like _event={isRepost ? originalEvent : event}/>
                        <Buy />
                        <Share />
                    </div>
                </div>
            {/if}
        </Dialog.Trigger>
    </Dialog.Root>
</div>