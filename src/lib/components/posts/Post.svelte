<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import {
        MessageCircle,
        Repeat2,
        Heart,
        Share,
        HandCoins,
    } from "lucide-svelte";
    import {
        profileFromEvent,
        type Profile,
        type UserInfo,
    } from "$lib/models/Profile";
    import Nip92 from "$lib/handlers/NIP92.svelte";
    import { user } from "$lib/stores/profile.store";
    import { onMount } from "svelte";
    import { info } from "$lib/ao/relay";
    import ReplyModal from '$lib/components/replies/ReplyModal.svelte';

    export let event: any;
    let _user: UserInfo;
    let profile: Profile;
    let event2: Event;
    let p: string;
    let q: string;
    let relay: string;

    let isReplyModalOpen = false;

    function formatDate(dateString: number): string {
        return new Date(dateString).toLocaleTimeString();
    }

    function toUrl(tx: string) {
        return (
            "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/" +
            tx
        );
    }

    function repost() {}
    function like() {}
    function share() {}
    function reply() {
        isReplyModalOpen = true;
        console.log("reply");
    }

    function handleReplySubmit(replyText: string) {
        console.log("Submitted Reply: ", replyText);
        isReplyModalOpen = false;
    }

    function parseTags() {
        if (event.Tags["e"]) {
            relay = event.Tags["e"];
        }
        if (event.Tags["p"]) {
            p = event.Tags["p"];
        }
        if (event.Tags["q"]) {
            q = event.Tags["q"];
        }
        if (p && relay && q) {
            event2 = JSON.parse(event.content);
        } else if (p && relay) {
            event2 = JSON.parse(q);
        }
    }
    parseTags();

    onMount(async () => {
        console.log("post event");
        console.log(event);
        _user = await info(event.From);
        profile = _user.Profile;
        console.log(_user);
        console.log(profile);
    });
    /*
    {#if event.kind == 6}
        {#if e && p && relay && q}
            <!--Quote-->
            <div>
                <Nip92 {event} />
            </div>
            <div class="border border-border rounded rounded-sm">
                <Nip92 event={event2} />
            </div>
        {:else if e && p && relay}
            <!--Repost-->
            <div class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <Repeat2 size={16} />
                <span>Reposted</span>
            </div>
            <div>
                <Nip92 event={event2} />
            </div>
        {/if}
    {/if}
    {#if event.kind == 1}
        <!--Quote-->
        <div class="pl-11 pr-11 pb-5 bg-blue-400">
            <Nip92 {event} />
        </div>
        <div class="border border-border rounded rounded-sm p-5">
            <div class="pl-11 pr-11 pb-5">
                <Nip92 {event} />
            </div>
        </div>
    {/if}
    */
</script>

{#if _user}
    <div class="pl-5 pt-5 pr-5">
        <div class="flex justify-start space-x-2">
            <Avatar.Root class="hidden h-9 w-9 sm:flex">
                {#if _user.Profile.name}
                    <Avatar.Image src={profile.picture} alt="Avatar" />
                {/if}
                <Avatar.Fallback>OM</Avatar.Fallback>
            </Avatar.Root>
            <div>
                <div class="flex space-x-1">
                    <p class="font-medium text-primary h-5">
                        {profile.name}
                    </p>
                    <p class="text-gray-500">
                        <!--{formatDate(_user.Profile.created_at)}-->
                    </p>
                </div>
                <Nip92 {event} />
            </div>
        </div>

        <div class="flex justify-between pl-8 py-2">
            <Button
                variant="link"
                size="icon"
                class="text-primary hover:bg-secondary rounded rounded-full"
                on:click={reply}
            >
                <MessageCircle strokeWidth={0.8} />
            </Button>
            <Button
                variant="link"
                size="icon"
                class="text-primary hover:bg-secondary rounded rounded-full"
                on:click={repost}
            >
                <Repeat2 strokeWidth={0.8} />
            </Button>
            <Button
                variant="link"
                size="icon"
                class="text-primary hover:bg-secondary rounded rounded-full"
                on:click={like}
            >
                <Heart strokeWidth={0.8} />
            </Button>
            <Button
                variant="link"
                size="icon"
                class="text-primary hover:bg-secondary rounded rounded-full"
            >
                <HandCoins strokeWidth={0.5} />
            </Button>
            <Button
                variant="link"
                size="icon"
                class="text-primary hover:bg-secondary rounded rounded-full"
                on:click={share}
            >
                <Share strokeWidth={0.8} />
            </Button>
        </div>
    </div>

    <ReplyModal
        bind:isOpen={isReplyModalOpen} 
        originalPost={{ author: profile.name, content: profile.about || "", avatar: profile.picture || "", event: event }}
        currentUser={{ name: profile.name , avatar: profile.picture || "" }}
        on:close={() => isReplyModalOpen = false}
        on:submit={(e) => handleReplySubmit(e.detail)} 
    />

{/if}
