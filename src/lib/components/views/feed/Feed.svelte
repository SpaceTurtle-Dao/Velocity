<script lang="ts">
    import {
        currentUser,
        userEvents,
        user,
        feedEvents,
    } from "$lib/stores/profile.store";
    import Post from "../../posts/Post.svelte";
    import * as Tabs from "$lib/components/ui/tabs/index.js";

    import { onMount } from "svelte";
    import { fetchEvents, fetchFeed } from "$lib/ao/relay";

    let events: Array<any> = [];
    let filters: Array<any> = [];

    feedEvents.subscribe((value) => {
        if (value.length > 0) {
            events = value;
        }
    });

    async function fetchFollowingEvents() {
        if ($currentUser) {
            let filter = {
                kinds: ["1"],
                since: 1663905355000,
                until: Date.now(),
                limit: 100,
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
                tags: []
            };
            filters.push(filter);
            let _filters = JSON.stringify(filters);
            if ($currentUser) {
                fetchFeed($currentUser.Process, _filters);
            }
        }
        filters = [];
    }

    onMount(async () => {});

    //transition-transform transform hover:scale-105 duration-300
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
                            <Post {event} />
                        </div>
                    {/each}
                </div>
            </Tabs.Content>
            <Tabs.Content value="following">
                <div class="">
                    {#each events as event}
                        <div class="border border-border max-w-prose">
                            <Post {event} />
                        </div>
                    {/each}
                </div>
            </Tabs.Content>
        </Tabs.Root>
    </div>
{/if}