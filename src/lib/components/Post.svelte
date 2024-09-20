<script lang="ts">
    import { Link } from "svelte-routing";
    import {
        Card,
        CardContent,
        CardFooter,
        CardHeader,
    } from "$lib/components/ui/card";
    import {
        Avatar,
        AvatarFallback,
        AvatarImage,
    } from "$lib/components/ui/avatar";
    import { Button } from "$lib/components/ui/button";
    import {
        MessageCircle,
        Share2,
        TrendingUp,
        DollarSign,
        Users,
        Activity,
        Coins,
    } from "lucide-svelte";

    import Pump from "$lib/components/Pump.svelte";
    import Dump from "$lib/components/Dump.svelte";
    import type { Event } from "$lib/models/Event";
    import { DECIMALS } from "$lib/constants";
    // @ts-ignore
    import * as Tabs from "$lib/components/ui/tabs";
    import { Video } from "flowbite-svelte";
    import {
        profileFromEvent,
        type Profile,
        type UserInfo,
    } from "$lib/models/Profile";
    import { user } from "../../stores/profile.store";
    export let event: Event;
    console.log(event);
    let loading = true;
    let userInfo: UserInfo;
    let userProfile: Profile;

    user.subscribe((value) => {
        userInfo = value;
        userProfile = profileFromEvent(userInfo.Profile);
    });

    function toUrl(tx: string) {
        return `https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/${tx}`;
    }

    function formatTime(timestamp: number): string {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days}d`;
        if (hours > 0) return `${hours}h`;
        if (minutes > 0) return `${minutes}m`;
        return "Just now";
    }

    function formatNumber(value: string | number): string {
        if (typeof value === "string") value = parseFloat(value);
        if (isNaN(value)) return "N/A";
        return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }

    // Simulate content loading
    setTimeout(() => {
        loading = false;
    }, 1000);
</script>

<div class="flex items-center space-x-4">
    <Avatar class="w-12 h-12 rounded-full border-2 border-blue-500 shadow-lg">
        <AvatarImage
            src={toUrl(userProfile.picture)}
            alt={userInfo.Profile.pubkey}
        />
        <AvatarFallback class="text-2xl bg-primary text-white">
            {userProfile.name.slice(0, 2)}
        </AvatarFallback>
    </Avatar>
    <div>
        <h3 class="text-sm font-bold text-white">
            {userProfile.name}
        </h3>
        <p class="text-sm text-gray-500">
            @{userProfile.name.slice(0, 12)} · {formatTime(
                userInfo.Profile.created_at,
            )}
        </p>
        <p class="text-xs text-gray-400">
            Joined {formatTime(userInfo.Profile.created_at)}
        </p>
    </div>
</div>

{#if loading}
    <div class="flex justify-center items-center h-48">
        <div
            class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"
        ></div>
    </div>
{:else if event.kind == 1}
    <p class="">
        {event.content}
    </p>
{/if}
