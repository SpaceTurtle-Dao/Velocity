<script lang="ts">
    import { onMount } from "svelte";
    import { z } from "zod";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { walletAddress } from "$lib/stores/walletStore";
    import { navigate } from "svelte-routing";
    import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";
    import { profileService } from "$lib/services/ProfileService";
    import { upload } from "$lib/ao/uploader";
    import { Camera } from "lucide-svelte";
    import {
        Avatar,
        AvatarFallback,
        AvatarImage,
    } from "$lib/components/ui/avatar";
    import { ARWEAVE_ADDRESS, PROFILE_REGISTRY_ID } from "$lib/constants";
    import { profileRegistryService } from "$lib/services/ProfileRegistryService";
    import { currentUser } from "$lib/stores/currentUser.store";

    const initialProfileSchema = z.object({
        name: z.string().min(1, "Name is required"),
        display_name: z.string().min(1, "Display Name is required"),
        description: z.string().optional(),
        thumbnail: z.string().optional(),
        coverImage: z.string().optional(),
        website: z.string().url().optional().or(z.literal("")),
    });

    type InitialProfileSchemaType = z.infer<typeof initialProfileSchema>;

    let profile: InitialProfileSchemaType = {
        name: "",
        display_name: "",
        description: "",
        thumbnail: "",
        coverImage: "",
        website: "",
    };

    let isOpen = false;
    let isLoading = false;
    let errors: Partial<Record<keyof InitialProfileSchemaType, string>> = {};

    // New variables for file handling
    let pictureFile: File | null = null;
    let coverImageFile: File | null = null;

    function toUrl(tx: string) {
        return ARWEAVE_ADDRESS + tx;
    }

    function handleFileChange(event: Event, type: "picture" | "banner") {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            if (type === "picture") {
                pictureFile = file;
            } else {
                coverImageFile = file;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                //@ts-ignore
                profile[type] = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    async function createProfile() {
        isLoading = true;
        try {
            initialProfileSchema.parse(profile);
            errors = {};

            if (pictureFile) {
                let _pictureFile = await upload(pictureFile);
                profile.thumbnail = _pictureFile.hash;
            }

            if (coverImageFile) {
                let _bannerFile = await upload(coverImageFile);
                profile.coverImage = _bannerFile.hash;
            }

            const profileId = await profileService.create({
                userName: profile.name,
                displayName: profile.display_name,
                description: profile.description,
                thumbnail: profile.thumbnail,
                coverImage: profile.coverImage,
            });

            if ($currentUser.address) {
                profileRegistryService.getZoneById(
                    PROFILE_REGISTRY_ID(),
                    $currentUser.address!,
                );
            }
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
            <Dialog.Title class="text-primary">Create Your Profile</Dialog.Title
            >
        </Dialog.Header>
        <form on:submit|preventDefault={() => {}} class="space-y-6">
            <!-- Banner Upload Section -->
            <div class="relative mb-16">
                <div class="h-32 bg-gray-200 relative">
                    {#if coverImageFile}
                        <img
                            src={URL.createObjectURL(coverImageFile)}
                            alt={profile.name}
                            class="w-full h-full object-cover"
                        />
                    {:else if profile.coverImage}
                        <img
                            src={profile.coverImage}
                            alt={profile.name}
                            class="w-full h-full object-cover"
                        />
                    {/if}
                    <label
                        for="banner"
                        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
                    >
                        <Camera size={24} class="text-white" />
                    </label>
                    <Input
                        id="banner"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        on:change={(e) => handleFileChange(e, "banner")}
                    />
                </div>
                <div class="absolute bottom-0 left-4 transform translate-y-1/3">
                    <div class="relative">
                        <Avatar class="w-24 h-24 border-4 border-white">
                            {#if pictureFile}
                                <AvatarImage
                                    class="object-cover"
                                    src={URL.createObjectURL(pictureFile)}
                                    alt={profile.name
                                        ? profile.name[0].toUpperCase()
                                        : "A"}
                                />
                                <AvatarFallback>
                                    {profile.name
                                        ? profile.name[0].toUpperCase()
                                        : "A"}
                                </AvatarFallback>
                            {:else if profile.thumbnail}
                                <AvatarImage
                                    class="object-cover"
                                    src={toUrl(profile.thumbnail)}
                                    alt={profile.name
                                        ? profile.name[0].toUpperCase()
                                        : "A"}
                                />
                                <AvatarFallback>
                                    {profile.name
                                        ? profile.name[0].toUpperCase()
                                        : "A"}
                                </AvatarFallback>
                            {/if}
                        </Avatar>
                        <label
                            for="picture"
                            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer"
                        >
                            <Camera size={20} class="text-white" />
                        </label>
                        <Input
                            id="picture"
                            type="file"
                            accept="image/*"
                            class="hidden"
                            on:change={(e) => handleFileChange(e, "picture")}
                        />
                    </div>
                </div>
            </div>

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

            <div class="space-y-2">
                <Label
                    for="description"
                    class="text-lg font-medium text-primary"
                    >Description (Optional)</Label
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
