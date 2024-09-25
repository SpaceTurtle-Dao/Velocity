<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { currentUser } from "$lib/stores/profile.store";
    import { profileFromEvent, type UserInfo } from "$lib/models/Profile";
    import Follow from "./Follow.svelte";
    import { onMount } from "svelte";

    export let data: UserInfo;
    let textWithUrl = "";
    const urlPattern = /(https?:\/\/[^\s]+)/g;

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleString();
    }

    onMount(async () => {

        textWithUrl = profileFromEvent(data.Profile).about;

        // Split the string into parts, keeping the URLs separate
        const parts = textWithUrl.split(urlPattern);

        // Get the <p> tag by ID
        const pTag: HTMLElement | null = document.getElementById(data.Profile.pubkey);

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
    });
</script>

<div class="border border-border rounded p-5 w-3/4">
    <div class="flex justify-between ">
        <div class="flex space-x-2">
            <Avatar.Root class="h-12 w-12">
                {#if profileFromEvent(data.Profile).picture}
                    <Avatar.Image
                        src={profileFromEvent(data.Profile).picture}
                        alt="Avatar"
                    />
                {/if}
                <Avatar.Fallback>OM</Avatar.Fallback>
            </Avatar.Root>

            <div>
                <p class="text-sm font-medium leading-none text-primary">
                    {profileFromEvent(data.Profile).name}
                </p>
                <p class="text-muted-foreground text-sm text-secondary">
                    {profileFromEvent(data.Profile).display_name}
                </p>
                <article class="pb-6 pt-1 text-primary text-wrap ...">
                    {#if profileFromEvent(data.Profile).about}
                        <p id={data.Profile.pubkey}></p>
                    {/if}
                </article>
            </div>
        </div>
        <Follow
            relay={data.Profile.pubkey}
            userRelay={$currentUser.Profile.pubkey}
            token={data.Token}
            quantity={data.SubscriptionCost.toString()}
        />
    </div>
</div>
