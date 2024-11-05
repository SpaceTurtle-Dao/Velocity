<script lang="ts">
    import { onMount } from "svelte";
    import { z } from "zod";
    import type { UserInfo } from "$lib/models/Profile";
    import { currentUser } from "$lib/stores/profile.store";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import {
        spawnRelay,
        relay,
        event as _event,
        info,
        getOwner,
        setRelay,
    } from "$lib/ao/relay";
    import { walletAddress } from "$lib/stores/walletStore";
    import { add } from "date-fns/fp/add";
    import { navigate } from "svelte-routing";
    import { createProcess, send } from "$lib/ao/process.svelte";
    import type { Tag } from "$lib/models/Tag";
    import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";

    // Zod schema for initial profile validation
    const initialProfileSchema = z.object({
        name: z.string().min(1, "Name is required"),
        display_name: z.string().min(1, "Display Name is required"),
    });

    type InitialProfileSchemaType = z.infer<typeof initialProfileSchema>;

    let profile: InitialProfileSchemaType = {
        name: "",
        display_name: "",
    };

    let isOpen = false;
    let spawnInterval: any;
    let evalInterval: any;
    let address: string;
    let _relay: string | undefined;
    let profileEvent: string;
    let isLoading = false;
    let userInfo: UserInfo;
    let errors: Partial<Record<keyof InitialProfileSchemaType, string>> = {};

    currentUser.subscribe((value) => {
        userInfo = value;
    });

    function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /*async function checkEvaluated() {
    let owner = await getOwner(_relay);
    console.log(owner);
    console.log(address);
    if (owner == address) {
      clearInterval(evalInterval);
      console.log("evaluated");
      await _event(profileEvent, _relay!);
      isLoading = false;
      navigate("/profile", { replace: true });
      isOpen = false; // Close the dialog
    } else {
      console.log("polling for eval");
    }
  }

  async function checkSpawned() {
    let __relay = await relay(address);
    if (__relay) {
      _relay = __relay;
      clearInterval(spawnInterval);
      console.log("relay");
      console.log(_relay);
      evalInterval = setInterval(checkEvaluated, 1000);
    } else {
      console.log("polling for relay");
    }
  }*/

    async function createProfile() {
        let tags: Array<Tag> = [];
        isLoading = true;
        try {
            // Validate the profile data
            initialProfileSchema.parse(profile);
            errors = {};

            // Prepare the content for the event
            const content = JSON.stringify({
                name: profile.name,
                display_name: profile.display_name,
            });

            const kindTag: Tag = {
                name: "Kind",
                value: "0", // Kind 0 is for metadata events in Nostr
            };

            const contentTag: Tag = {
                name: "Content",
                value: content,
            };
            tags.push(kindTag);
            tags.push(contentTag);
            profileEvent = JSON.stringify(event);
            try {
                _relay = await spawnRelay();
                console.log("Got Relay " + _relay);
                await _event(tags, _relay!);
                await setRelay(_relay!);
                isLoading = false;
                navigate("/profile", { replace: true });
                isOpen = false; // Close the dialog
            } catch (error) {
                console.error("Error creating profile:", error);
                isLoading = false;
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                errors = err.flatten().fieldErrors as Partial<
                    Record<keyof InitialProfileSchemaType, string>
                >;
            }
            isLoading = false;
        }
    }

    onMount(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    });
</script>

<Dialog.Root bind:open={isOpen}>
    <Dialog.Trigger>
        <Button
            class="w-44 h-12 bg-primary text-secondary rounded-full py-3 font-bold text-lg hover:bg-ring transition-colors duration-200 flex items-center justify-center"
        >
            Create Profile
        </Button>
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title class="text-primary">Create Your Profile</Dialog.Title
            >
        </Dialog.Header>
        <form on:submit|preventDefault={() => {}} class="space-y-6">
            <div class="space-y-2">
                <Label for="name" class="text-lg font-medium text-primary"
                    >Name</Label
                >
                <Input
                    id="name"
                    bind:value={profile.name}
                    placeholder="Enter your name"
                    class="w-full p-2 border rounded text-primary"
                />
                {#if errors.name}
                    <p class="text-red-500 text-sm">{errors.name}</p>
                {/if}
            </div>

            <div class="space-y-2">
                <Label
                    for="display_name"
                    class="text-lg font-medium text-primary">Display Name</Label
                >
                <Input
                    id="display_name"
                    bind:value={profile.display_name}
                    placeholder="Enter your display name"
                    class="w-full p-2 border rounded text-primary"
                />
                {#if errors.display_name}
                    <p class="text-red-500 text-sm">{errors.display_name}</p>
                {/if}
            </div>
            <Dialog.Footer>
                <div class="flex w-full justify-center">
                    <ButtonWithLoader
                        class="w-48 py-2 px-4  rounded-full text-md font-bold"
                        disabled={isLoading}
                        loader={isLoading}
                        on:click={createProfile}
                        >Create Profile</ButtonWithLoader
                    >
                </div>
            </Dialog.Footer>
        </form>
    </Dialog.Content>
</Dialog.Root>
