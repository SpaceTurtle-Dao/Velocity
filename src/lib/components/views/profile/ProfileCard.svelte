<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { currentUser } from "$lib/stores/profile.store";
    import { profileFromEvent, type UserInfo } from "$lib/models/Profile";
    import Follow from "$lib/components/Follow/Follow.svelte";
    import { onMount } from "svelte";
    import * as Card from "$lib/components/ui/card";
    import * as HoverCard from "$lib/components/ui/hover-card";
    import { link } from "svelte-spa-router";

    export let data: UserInfo;
    let textWithUrl = "";
    const urlPattern = /(https?:\/\/[^\s]+)/g;

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleString();
    }

    onMount(async () => {
        if (data.Profile.about) {
            textWithUrl = data.Profile.about;

            // Split the string into parts, keeping the URLs separate
            const parts = textWithUrl.split(urlPattern);

            // Get the <p> tag by ID
            const pTag: HTMLElement | null = document.getElementById(
                data.Process,
            );

            // Loop over the parts and create text or links accordingly
            parts.forEach((part) => {
                if (pTag) {
                    if (urlPattern.test(part)) {
                        // If the part is a URL, create an <a> tag
                        const linkElement = document.createElement("a");
                        linkElement.className = "text-blue-400";
                        linkElement.href = part; // Set the href attribute
                        linkElement.textContent = part; // Set the text content
                        linkElement.target = "_blank"; // Open link in new tab
                        pTag?.appendChild(linkElement);
                    } else {
                        // If the part is not a URL, append it as plain text
                        pTag!.appendChild(document.createTextNode(part));
                    }
                }
            });
        }
    });
</script>

{#if $currentUser}
<div class="flex items-center gap-20">
    <div class="flex gap-2">
        <Avatar.Root class="hidden h-9 w-9 sm:flex">
            {#if data.Profile.picture}
                <Avatar.Image
                    src={data.Profile.picture}
                    alt="Avatar"
                />
            {/if}
            <Avatar.Fallback>SD</Avatar.Fallback>
        </Avatar.Root>
        <div class="grid gap-1">
            <HoverCard.Root>
                <HoverCard.Trigger>
                    <a
                        href="/profile/{data.Process}"
                        use:link
                        class="rounded-sm underline-offset-4 hover:underline focus-visible:outline-0 focus-visible:outline-offset-8 focus-visible:outline-transparent"
                    >
                        {data.Profile.name}
                    </a>
                </HoverCard.Trigger>
                <HoverCard.Content class="w-80 border border-border rounded">
                    <div class="flex space-x-4">
                        <Avatar.Root>
                            {#if data.Profile.picture}
                                <Avatar.Image
                                    src={data.Profile.picture}
                                    alt="Avatar"
                                />
                            {/if}
                            <Avatar.Fallback>SD</Avatar.Fallback>
                        </Avatar.Root>
                        <div class="space-y-1">
                            <h4 class="text-sm font-semibold">{data.Profile.name}</h4>
                            {#if data.Profile.about}
                                <p id={data.Process} class="text-sm">
                                    {data.Profile.about}
                                </p>
                            {/if}

                            <div class="flex space-x-5 pt-2.5">
                                <div class="flex space-x-1">
                                    <p class="text-primary">
                                        {data.Subscriptions}
                                    </p>
                                    <p class="text-gray-400">Following</p>
                                </div>
                                <div class="flex space-x-1">
                                    <p class="text-primary">{data.Subs}</p>
                                    <p class="text-gray-400">Follower</p>
                                </div>
                            </div>
                            <div class="flex items-center pt-2">
                                <span class="text-muted-foreground text-xs">
                                    Joined September 2022
                                </span>
                            </div>
                        </div>
                    </div>
                </HoverCard.Content>
            </HoverCard.Root>
            <p class="text-muted-foreground text-sm">
                @{data.Profile.display_name}
                @{data.Profile.display_name}
            </p>
        </div>
    </div>
    <div class="ml-auto font-medium">
        <Follow
            relay={data.Process}
            userRelay={$currentUser.Process}
        />
    </div>
</div>

{/if}