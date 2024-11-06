<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { currentUser } from "$lib/stores/profile.store";
    import { profileFromEvent, type UserInfo } from "$lib/models/Profile";
    import Follow from "$lib/components/Follow/Follow.svelte";
    import { onMount } from "svelte";
    import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
    import ProfileHoverCard from "$lib/components/UserProfile/ProfileHoverCard.svelte";
    import SubUnsubButton from "$lib/components/UserProfile/SubUnsubButton.svelte";

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

    let isUserSubscribed: boolean;
</script>

{#if $currentUser}
    <div class="flex items-center justify-between w-full min-w-0">
        <div class="flex gap-2">
            <div class="hidden sm:flex">
                <ProfilePicture
                    src={data.Profile.picture}
                    name={data.Profile.name}
                />
            </div>
            <div class="grid gap-1 overflow-hidden">
                <ProfileHoverCard userInfo={data} bind:isUserSubscribed>
                    {data.Profile.name}
                </ProfileHoverCard>

                <p class="text-muted-foreground text-sm truncate">
                    @{data.Profile.display_name}
                </p>
            </div>
        </div>
        <div class="ml-3 font-medium">
            <SubUnsubButton
                targetProcess={data.Process}
                bind:isUserSubscribed
            />
        </div>
    </div>
{/if}
