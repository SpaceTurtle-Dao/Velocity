<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { z } from "zod";
  import type { Profile } from "$lib/models/Profile";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "$lib/components/ui/avatar";
  import { Camera, X } from "lucide-svelte";
  import { upload } from "$lib/ao/uploader";
  import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";
  import { currentUser } from "$lib/services/CurrentUser";
  import { profileService } from "$lib/services/ProfileService";
  import { HUB_REGISTRY_ID, toUrl } from "$lib/constants";
  import { hubRegistryService } from "$lib/services/HubRegistryService";

  export let initialProfile: Profile;

  // Zod schema for profile validation
  const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    display_name: z.string().min(1, "Display Name is required"),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    coverImage: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
    bot: z.boolean().optional(),
  });

  type ProfileSchemaType = z.infer<typeof profileSchema>;

  let _profile: ProfileSchemaType = {
    name: initialProfile.userName || "",
    display_name: initialProfile.displayName || "",
    description: initialProfile.description || "",
    thumbnail: initialProfile.thumbnail || "",
    coverImage: initialProfile.coverImage || "",
    website: initialProfile.website || "",
    bot: initialProfile.bot || false,
  };

  let errors: Partial<Record<keyof ProfileSchemaType, string>> = {};

  let pictureFile: File | null = null;
  let coverImageFile: File | null = null;
  let loader = false;

  const dispatch = createEventDispatcher();

  function handleFileChange(event: Event, type: "thumbnail" | "coverImage") {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      if (type === "thumbnail") {
        pictureFile = file;
      } else {
        coverImageFile = file;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        _profile[type] = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  function closeModal() {
    dispatch("close");
  }

  async function updateProfile() {
    if (!initialProfile) return;
    loader = true;
    try {
      profileSchema.parse(_profile);
      errors = {};
      if (pictureFile) {
        let _pictureFile = await upload(pictureFile);
        _profile.thumbnail = _pictureFile.hash;
      }
      if (coverImageFile) {
        let _coverImageFile = await upload(coverImageFile);
        _profile.coverImage = _coverImageFile.hash;
      }

      try {
        if ($currentUser) {
          initialProfile.userName = _profile.name;
          initialProfile.displayName = _profile.display_name;
          initialProfile.description = _profile.description;
          initialProfile.thumbnail = _profile.thumbnail;
          initialProfile.coverImage = _profile.coverImage;

          const result = await currentUser.updateProfile(
            initialProfile.from,
            initialProfile,
          );
          let spec = $currentUser.zone.spec;
          spec.profile = initialProfile;
          await hubRegistryService.register(HUB_REGISTRY_ID(), spec);
          await profileService.fetchProfiles(initialProfile.from, [
            $currentUser.address,
          ]);
          console.log("Profile updated successfully:", result);
          dispatch("profileUpdated");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        errors = err.flatten().fieldErrors as Partial<
          Record<keyof ProfileSchemaType, string>
        >;
      } else {
        console.error("Unexpected error:", err);
      }
    } finally {
      loader = false;
    }
  }

  onMount(async () => {});
</script>

{#if _profile}
  <!-- Modal Backdrop -->
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
    on:click={closeModal}
    on:keydown={(e) => e.key === 'Escape' && closeModal()}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <!-- Modal Container -->
    <div 
      class="bg-background rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" 
      on:click|stopPropagation
      on:keydown|stopPropagation
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-4 border-b border-border">
        <h2 id="modal-title" class="text-xl font-semibold text-foreground">Edit Profile</h2>
        <button 
          type="button"
          on:click={closeModal}
          class="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Cover Image Section -->
        <div class="relative">
          <div class="h-32 sm:h-40 bg-gradient-to-r from-blue-400 to-purple-500 relative overflow-hidden">
            {#if coverImageFile}
              <img
                src={URL.createObjectURL(coverImageFile)}
                alt="Cover"
                class="w-full h-full object-cover"
              />
            {:else if _profile.coverImage}
              <img
                src={toUrl(_profile.coverImage)}
                alt="Cover"
                class="w-full h-full object-cover"
              />
            {/if}
            <div class="absolute inset-0 bg-black/20"></div>
            <label
              for="coverImage"
              class="absolute top-3 right-3 bg-black/50 hover:bg-black/70 transition-colors p-2 rounded-full cursor-pointer"
            >
              <Camera size={14} class="text-white" />
            </label>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              class="hidden"
              on:change={(e) => handleFileChange(e, "coverImage")}
            />
          </div>

          <!-- Profile Picture -->
          <div class="absolute -bottom-10 left-4">
            <div class="relative">
              <Avatar class="w-20 h-20 border-4 border-background shadow-lg">
                {#if pictureFile}
                  <AvatarImage
                    class="object-cover"
                    src={URL.createObjectURL(pictureFile)}
                    alt={_profile.name}
                  />
                {:else if _profile.thumbnail}
                  <AvatarImage
                    class="object-cover"
                    src={toUrl(_profile.thumbnail)}
                    alt={_profile.name}
                  />
                {:else}
                  <AvatarFallback class="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {_profile.name ? _profile.name[0].toUpperCase() : "U"}
                  </AvatarFallback>
                {/if}
              </Avatar>
              <label
                for="picture"
                class="absolute -bottom-1 -right-1 bg-primary hover:bg-primary/90 transition-colors p-1.5 rounded-full cursor-pointer shadow-lg"
              >
                <Camera size={12} class="text-primary-foreground" />
              </label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                class="hidden"
                on:change={(e) => handleFileChange(e, "thumbnail")}
              />
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="pt-12 p-4">
          <form on:submit|preventDefault={() => {}} class="space-y-6">
            <!-- Basic Info Card -->
            <Card class="border-0 shadow-sm">
              <CardHeader class="pb-4">
                <CardTitle class="text-lg text-foreground">Basic Information</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="name" class="text-sm font-medium text-foreground">Name *</Label>
                    <Input 
                      id="name" 
                      bind:value={_profile.name}
                      class="h-10 rounded-lg border-input bg-background text-foreground"
                      placeholder="Enter your name"
                    />
                    {#if errors.name}
                      <p class="text-destructive text-xs">{errors.name}</p>
                    {/if}
                  </div>

                  <div class="space-y-2">
                    <Label for="display_name" class="text-sm font-medium text-foreground">Display Name *</Label>
                    <Input 
                      id="display_name" 
                      bind:value={_profile.display_name}
                      class="h-10 rounded-lg border-input bg-background text-foreground"
                      placeholder="Enter display name"
                    />
                    {#if errors.display_name}
                      <p class="text-destructive text-xs">{errors.display_name}</p>
                    {/if}
                  </div>
                </div>

                <div class="space-y-2">
                  <Label for="description" class="text-sm font-medium text-foreground">About</Label>
                  <Textarea
                    id="description"
                    bind:value={_profile.description}
                    rows={3}
                    class="resize-none rounded-lg border-input bg-background text-foreground"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div class="space-y-2">
                  <Label for="website" class="text-sm font-medium text-foreground">Website</Label>
                  <Input 
                    id="website" 
                    type="url" 
                    bind:value={_profile.website}
                    class="h-10 rounded-lg border-input bg-background text-foreground"
                    placeholder="https://your-website.com"
                  />
                  {#if errors.website}
                    <p class="text-destructive text-xs">{errors.website}</p>
                  {/if}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 border-t border-border">
        <div class="flex gap-3">
          <button
            type="button"
            on:click={closeModal}
            class="flex-1 h-10 px-4 rounded-lg border border-input bg-background hover:bg-accent transition-colors text-foreground font-medium"
          >
            Cancel
          </button>
          <ButtonWithLoader
            class="flex-1 h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors disabled:opacity-50"
            {loader}
            disabled={loader}
            on:click={updateProfile}
          >
            {loader ? "Updating..." : "Update Profile"}
          </ButtonWithLoader>
        </div>
      </div>
    </div>
  </div>
{/if}