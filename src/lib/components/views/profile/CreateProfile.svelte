<script lang="ts">
    import { onMount } from "svelte";
    import { z } from "zod";
    import { currentUser } from "$lib/stores/profile.store";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { walletAddress } from "$lib/stores/walletStore";
    import { navigate } from "svelte-routing";
    import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";
    import { profileService } from "$lib/services/ProfileService";

    const initialProfileSchema = z.object({
        name: z.string().min(1, "Name is required"),
        display_name: z.string().min(1, "Display Name is required"),
        description: z.string().optional()
    });

    type InitialProfileSchemaType = z.infer<typeof initialProfileSchema>;

    let profile: InitialProfileSchemaType = {
        name: "",
        display_name: "",
        description: ""
    };

    let isOpen = false;
    let isLoading = false;
    let errors: Partial<Record<keyof InitialProfileSchemaType, string>> = {};

    async function createProfile() {
        isLoading = true;
        try {
            initialProfileSchema.parse(profile);
            errors = {};

            // const address = $walletAddress;
            // if (!address) {
            //     throw new Error("Wallet address not found");
            // }

            const profileId = await profileService.create({
                userName: profile.name,
                displayName: profile.display_name,
                description: profile.description
            });

            const newProfile = await profileService.getById(profileId);
            currentUser.set(newProfile);

            // Navigate and close dialog
            isLoading = false;
            navigate("/profile", { replace: true });
            isOpen = false;
        } catch (err) {
            if (err instanceof z.ZodError) {
                errors = err.flatten().fieldErrors as Partial<
                    Record<keyof InitialProfileSchemaType, string>
                >;
            } else {
                console.error("Error creating profile:", err);
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
            <Dialog.Title class="text-primary">Create Your Profile</Dialog.Title>
        </Dialog.Header>
        <form on:submit|preventDefault={() => {}} class="space-y-6">
            <div class="space-y-2">
                <Label for="name" class="text-lg font-medium text-primary">Name</Label>
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

            <div class="space-y-2">
                <Label
                    for="description"
                    class="text-lg font-medium text-primary">Description (Optional)</Label
                >
                <Input
                    id="description"
                    bind:value={profile.description}
                    placeholder="Tell us about yourself"
                    class="w-full p-2 border rounded text-primary"
                />
            </div>

            <Dialog.Footer>
                <div class="flex w-full justify-center">
                    <ButtonWithLoader
                        class="w-48 py-2 px-4 rounded-full text-md font-bold"
                        disabled={isLoading}
                        loader={isLoading}
                        on:click={createProfile}
                    >
                        Create Profile
                    </ButtonWithLoader>
                </div>
            </Dialog.Footer>
        </form>
    </Dialog.Content>
</Dialog.Root>