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
    import ReplyModal from '$lib/components/Reply/ReplyModal.svelte';


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
                <Reply event={event} user={_user}/>
                <Repost />
                <Like id={event.Id} pubkey={event.From} timestamp={event.timestamp}/>
                <Buy />
                <Share />
            </div>
        </div>
    </div>

{/if}
