<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { MessageCircle, Repeat2, Heart, HandCoins } from "lucide-svelte";
    import {
        profileFromEvent,
        type Profile,
        type UserInfo,
    } from "$lib/models/Profile";
    import Nip92 from "$lib/handlers/NIP92.svelte";
    import { user } from "$lib/stores/profile.store";
    import { onMount } from "svelte";
    import { info } from "$lib/ao/relay";
    import Like from "$lib/components/views/engagement/Like.svelte";
    import Reply from "$lib/components/views/engagement/Reply.svelte";
    import Repost from "$lib/components/views/engagement/Repost.svelte";
    import Buy from "$lib/components/views/engagement/Buy.svelte";
    import Share from "$lib/components/views/engagement/Share.svelte";

    export let event: any;
    let _user: UserInfo;
    let profile: Profile;
    let event2: Event;
    let p: string;
    let q: string;
    let relay: string;

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
    function reply() {}

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
        <div>
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
            <div class="flex justify-between py-2 px-10">
                <Reply />
                <Repost />
                <Like />
                <Buy />
                <Share />
            </div>
        </div>
    </div>
{/if}
