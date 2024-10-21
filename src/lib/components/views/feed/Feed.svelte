<script lang="ts">
    import {
        currentUser,
        userEvents,
        user,
        feedEvents,
    } from "$lib/stores/profile.store";
    import Post from "$lib/components/posts/Post.svelte";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import { onMount } from "svelte";
    import { fetchEvents, fetchFeed, info, relay, relays } from "$lib/ao/relay";

    let events: Array<any> = [];
    let filters: Array<any> = [];

    feedEvents.subscribe((value) => {
        if (value.length > 0) {
            events = processEvents(value);
        }
    });

    function processEvents(rawEvents: any) {
        const postMap = new Map();
        const topLevelPosts :any = [];

        //@ts-ignore
        rawEvents.forEach(event => {
            postMap.set(event.Id, { ...event, replies: [] });
        });

        //@ts-ignore
        rawEvents.forEach(event => {
            if (event.Tags["marker"] === "reply") {
                const parentId = event.Tags["e"];
                const parent = postMap.get(parentId);
                if (parent) {
                    parent.replies.push(postMap.get(event.Id));
                } else {
                    topLevelPosts.push(postMap.get(event.Id));
                }
            } else if (event.Tags["marker"] === "root" || !event.Tags["marker"]) {
                topLevelPosts.push(postMap.get(event.Id));
            }
        });
        //@ts-ignore
        return topLevelPosts;
    }

    async function fetchFollowingEvents() {
        if ($currentUser) {
            let filter = {
                kinds: ["1"],
                since: 1663905355000,
                until: Date.now(),
                limit: 100,
                tags: {marker: ["root", "reply"]}
            };
            filters.push(filter);
            let _filters = JSON.stringify(filters);
            if ($currentUser) {
                fetchFeed($currentUser.Process, _filters);
            }
        }
        filters = [];
    }

    async function fetchFeedEvents() {
        if ($currentUser) {
            let filter = {
                kinds: ["1"],
                since: 1663905355000,
                until: Date.now(),
                limit: 100,
                tags: {marker: ["root", "reply"]}
            };
            filters.push(filter);
            let _filters = JSON.stringify(filters);
            if ($currentUser) {
                fetchFeed($currentUser.Process, _filters);
            }
        }
        filters = [];
    }

    onMount(async () => {
        // Initial fetch can go here if needed
        await fetchFeedEvents();
    });

    function handleNewReply(event: any) {
        const newReply = event.detail;
        events = processEvents([...events.flat(), newReply]);
    }
</script>

{#if $currentUser}
    <div class="mt-10 max-w-prose">
        <Tabs.Root value="for you" class="max-w-prose">
            <Tabs.List class="grid grid-cols-2">
                <Tabs.Trigger
                    class="underline-tabs-trigger"
                    on:click={fetchFeedEvents}
                    value="for you">For You</Tabs.Trigger
                >
                <Tabs.Trigger on:click={fetchFollowingEvents} value="following"
                    >Following</Tabs.Trigger
                >
            </Tabs.List>
            <Tabs.Content value="for you">
                <div class="">
                    {#each events as event}
                        <div class="border border-border max-w-prose">
                            <Post {event} replies={event.replies} on:newReply={handleNewReply} />
                        </div>
                    {/each}
                </div>
            </Tabs.Content>
            <Tabs.Content value="following">
                <div class="">
                    {#each events as event}
                        <div class="border border-border max-w-prose">
                            <Post {event} replies={event.replies} on:newReply={handleNewReply} />
                        </div>
                    {/each}
                </div>
            </Tabs.Content>
        </Tabs.Root>
    </div>
{/if}