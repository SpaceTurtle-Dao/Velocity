<script lang="ts">
    import {
        currentUser,
        userEvents,
        user,
        feedEvents,
    } from "$lib/stores/profile.store";
    import type { Event } from "$lib/models/Event";
    import Post from "../../Post.svelte";
    import * as Tabs from "$lib/components/ui/tabs/index.js";

    import { onMount } from "svelte";
    import { fetchEvents, fetchFeed } from "$lib/ao/relay";

    let events: Array<Event> = [];
    let filters: Array<any> = [];

    feedEvents.subscribe((value) => {
        if (value.length > 0) {
            events = value;
        }
    });

    async function fetchMedia() {
        console.log("Fetching Media");
        events = [];
        if ($currentUser) {
            let filter = {
                kinds: [1],
                since: 1663905355000,
                until: Date.now(),
                limit: 100,
                "#imeta": [
                    "m image/apng",
                    "m image/avif",
                    "m image/gif",
                    "m image/jpeg",
                    "m image/png",
                    "m image/svg+xml",
                    "m image/webp",
                    "m video/x-msvideo",
                    "m video/mp4",
                    "m video/mpeg",
                    "m video/ogg",
                    "m video/webm",
                ],
            };
            filters.push(filter);
            let _filters = JSON.stringify(filters);
            if ($currentUser) {
                fetchFeed($currentUser.Profile.pubkey, _filters);
            }
        }
        filters = [];
    }

    async function fetchPost() {
        console.log("Fetching Post");
        events = [];
        if ($currentUser) {
            let filter = {
                kinds: [1],
                since: 1663905355000,
                until: Date.now(),
                limit: 100,
            };
            filters.push(filter);
            let _filters = JSON.stringify(filters);
            if ($currentUser) {
                fetchFeed($currentUser.Profile.pubkey, _filters);
            }
        }
        filters = [];
    }

    onMount(async () => {});

    //transition-transform transform hover:scale-105 duration-300
</script>

{#if $currentUser}
    <div class="mt-10 max-w-prose">
        <Tabs.Root value="post" class="max-w-prose">
            <Tabs.List class="grid grid-cols-4">
                <Tabs.Trigger
                    class="underline-tabs-trigger"
                    on:click={fetchPost}
                    value="post">Post</Tabs.Trigger
                >
                <Tabs.Trigger on:click={fetchMedia} value="media"
                    >Media</Tabs.Trigger
                >
                <Tabs.Trigger value="following">Following</Tabs.Trigger>
                <Tabs.Trigger value="followers">Followers</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="post">
                <div class="">
                    {#each events as event}
                        <div class="border border-border max-w-prose">
                            <Post {event} />
                        </div>
                    {/each}
                </div>
            </Tabs.Content>
            <Tabs.Content value="media">
                <div class="">
                    {#each events as event}
                        <div class="border border-border max-w-prose">
                            <Post {event} />
                        </div>
                    {/each}
                </div>
            </Tabs.Content>
            <Tabs.Content value="following"></Tabs.Content>
            <Tabs.Content value="followers"></Tabs.Content>
        </Tabs.Root>
    </div>
{/if}
