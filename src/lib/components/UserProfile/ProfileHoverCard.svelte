<script lang="ts">
    import * as HoverCard from "$lib/components/ui/hover-card";
    import ProfilePicture from "./ProfilePicture.svelte";
    import { link } from "svelte-spa-router";
    import { getDisplayUrl } from "$lib/utils/url.utils";
    import { isSubscribed, subscribe, unsubscribe } from "$lib/ao/relay";
    import { currentUser } from "$lib/stores/profile.store";
    import { onMount } from "svelte";
    import type { UserInfo } from "$lib/models/Profile";
    import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";

    export let userInfo: UserInfo;

    // this for binding parent component and letting parent know that the subscription updated
    export let isUserSubscribed: boolean;

    let isSubLoading = true;
    async function loadIsSubscribed() {
        isUserSubscribed = await isSubscribed(
            $currentUser.Process,
            userInfo.Process,
        );
    }
    onMount(async () => {
        await loadIsSubscribed();
        isSubLoading = false;
    });

    let loader = false;
    async function subscribeTarget() {
        loader = true;

        try {
            await subscribe($currentUser.Process, userInfo.Process);

            isUserSubscribed = true;
        } catch (error) {
            console.error(error);
        } finally {
            loader = false;
        }
    }

    async function unsubscribeTarget() {
        loader = true;

        try {
            await unsubscribe($currentUser.Process, userInfo.Process);

            isUserSubscribed = false;
        } catch (error) {
            console.error(error);
        } finally {
            loader = false;
        }
    }
</script>

<HoverCard.Root>
    <HoverCard.Trigger>
        <a href="/profile/{userInfo.Process}" use:link>
            <slot />
        </a>
    </HoverCard.Trigger>
    <HoverCard.Content align="start">
        <div class="flex justify-between">
            <ProfilePicture
                name={userInfo.Profile.name}
                src={userInfo.Profile.picture}
                size="xl"
            />

            {#if isSubLoading}
                <div class="h-9 w-32 bg-muted rounded-full animate-pulse"></div>
            {:else if isUserSubscribed}
                <ButtonWithLoader
                    {loader}
                    class="group text-base font-bold h-9 w-32 rounded-full text-primary  hover:border-red-800 border-input bg-background hover:bg-accent hover:text-accent-foreground border"
                    on:click={unsubscribeTarget}
                    disabled={loader}
                >
                    <span class="group-hover:hidden">Subscribed</span>
                    <span class="hidden group-hover:block text-red-500"
                        >Unsubscribe
                    </span>
                </ButtonWithLoader>
            {:else}
                <ButtonWithLoader
                    {loader}
                    class="group text-base font-bold h-9 w-32 rounded-full"
                    on:click={subscribeTarget}
                    disabled={loader}
                    >Subscribe
                </ButtonWithLoader>
            {/if}
        </div>

        <div class="text-primary text-lg font-bold">
            {userInfo.Profile.name}
        </div>

        <div class="text-muted-foreground text-base font-normal">
            @{userInfo.Profile.display_name}
        </div>

        {#if userInfo.Profile.about}
            <div class="text-primary text-base font-normal mt-4">
                {userInfo.Profile.about}
            </div>
        {/if}

        {#if userInfo.Profile.website}
            <div class="mt-4">
                <a
                    class="text-blue-500 hover:underline"
                    href={userInfo.Profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {getDisplayUrl(userInfo.Profile.website)}
                </a>
            </div>
        {/if}

        <div class="flex justify-between mt-4">
            <div>
                <span class="text-sm font-bold">{userInfo.Subscriptions}</span>
                <span class="text-sm font-normal text-muted-foreground"
                    >Subscribing</span
                >
            </div>
            <div>
                <span class="text-sm font-bold">{userInfo.Subs}</span>
                <span class="text-sm font-normal text-muted-foreground"
                    >Subscribers</span
                >
            </div>
        </div>
    </HoverCard.Content>
</HoverCard.Root>
