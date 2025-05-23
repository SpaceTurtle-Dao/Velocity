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
  import { Camera } from "lucide-svelte";
  import { upload } from "$lib/ao/uploader";
  import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";
  import { currentUser } from "$lib/services/UserService";
  import { profileService } from "$lib/services/ProfileService";

  export let initialProfile: Profile;

  // Function to format Arweave transaction URLs
  function toUrl(tx: string) {
    return "https://arweave.net/" + tx;
  }

  // Zod schema for profile validation
  const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    display_name: z.string().min(1, "Display Name is required"),
    description: z.string().optional(),
    profileImage: z.string().optional(),
    coverImage: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
    bot: z.boolean().optional(),
  });

  type ProfileSchemaType = z.infer<typeof profileSchema>;

  let _profile: ProfileSchemaType = {
    name: initialProfile.userName || "",
    display_name: initialProfile.displayName || "",
    description: initialProfile.description || "",
    profileImage: initialProfile.thumbnail || "",
    coverImage: initialProfile.coverImage || "",
    website: initialProfile.website || "",
    bot: initialProfile.bot || false,
  };

  let errors: Partial<Record<keyof ProfileSchemaType, string>> = {};

  let pictureFile: File | null = null;
  let coverImageFile: File | null = null;
  let loader = false;

  const dispatch = createEventDispatcher();

  function handleFileChange(event: Event, type: "profileImage" | "coverImage") {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      if (type === "profileImage") {
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

  async function updateProfile() {
    if (!initialProfile) return;
    loader = true;
    try {
      profileSchema.parse(_profile);
      errors = {};
      if (pictureFile) {
        let _pictureFile = await upload(pictureFile);
        _profile.profileImage = _pictureFile.hash;
      }
      if (coverImageFile) {
        let _coverImageFile = await upload(coverImageFile);
        _profile.coverImage = _coverImageFile.hash;
      }

      //const updated_at = Date.now();

      /*const content = JSON.stringify({
        name: profile.name,
        display_name: profile.display_name,
        about: profile.about,
        dateCreated: initialProfile?.dateCreated,
        updated_at,
        thumbnail: profile.profileImage,
        website: profile.website,
        coverImage: profile.coverImage,
        bot: profile.bot,
      });*/
      try {
        if ($currentUser) {
          /*const tags: Tag[] = [
            { name: "UserName", value: profile.name },
            { name: "DisplayName", value: profile.display_name },
            { name: "Description", value: profile.about || "" },
            { name: "CoverImage", value: profile.coverImage || "" },
            { name: "ProfileImage", value: profile.profileImage || "" },
          ];*/

          initialProfile.userName = _profile.name
          initialProfile.displayName = _profile.display_name
          initialProfile.description = _profile.description
          initialProfile.thumbnail = _profile.profileImage
          initialProfile.coverImage = _profile.coverImage

          const result = await currentUser.updateProfile(
            initialProfile.from,
            initialProfile,
          );
          await profileService.fetchProfiles(initialProfile.from, [$currentUser.address])
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
  <div class="mx-auto max-w-2xl p-4">
    <Card class="w-full relative border border-border rounded-lg">
      <CardHeader>
        <CardTitle>Update Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form on:submit|preventDefault={() => {}} class="space-y-6">
          <div class="relative mb-16">
            <div class="h-32 bg-gray-200 relative">
              {#if coverImageFile}
                <img
                  src={URL.createObjectURL(coverImageFile)}
                  alt="coverImage"
                  class="w-full h-full object-cover"
                />
              {:else if _profile.coverImage}
                <img
                  src={toUrl(_profile.coverImage)}
                  alt="coverImage"
                  class="w-full h-full object-cover"
                />
              {/if}
              <label
                for="coverImage"
                class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
              >
                <Camera size={24} class="text-white" />
              </label>
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                class="hidden"
                on:change={(e) => handleFileChange(e, "coverImage")}
              />
            </div>
            <div class="absolute bottom-0 left-4 transform translate-y-1/3">
              <div class="relative">
                <Avatar class="w-24 h-24 border-4 border-white">
                  {#if pictureFile}
                    <AvatarImage
                      class="object-cover"
                      src={URL.createObjectURL(pictureFile)}
                      alt={_profile.name}
                    />
                  {:else if _profile.profileImage}
                    <AvatarImage
                      class="object-cover"
                      src={toUrl(_profile.profileImage)}
                      alt={_profile.name}
                    />
                  {:else}
                    <AvatarFallback
                      >{_profile.name
                        ? _profile.name[0].toUpperCase()
                        : "U"}</AvatarFallback
                    >
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
                  on:change={(e) => handleFileChange(e, "profileImage")}
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="name">Name *</Label>
              <Input id="name" bind:value={_profile.name} />
              {#if errors.name}
                <p class="text-red-500 text-sm">{errors.name}</p>
              {/if}
            </div>

            <div class="space-y-2">
              <Label for="display_name">Display Name *</Label>
              <Input id="display_name" bind:value={_profile.display_name} />
              {#if errors.display_name}
                <p class="text-red-500 text-sm">
                  {errors.display_name}
                </p>
              {/if}
            </div>
          </div>

          <div class="space-y-2">
            <Label for="description">About</Label>
            <Textarea
              id="description"
              bind:value={_profile.description}
              rows={3}
            />
          </div>

          <div class="space-y-2">
            <Label for="website">Website</Label>
            <Input id="website" type="url" bind:value={_profile.website} />
            {#if errors.website}
              <p class="text-red-500 text-sm">{errors.website}</p>
            {/if}
          </div>

          <ButtonWithLoader
            class="bg-primary text-primary-foreground px-8 w-full rounded-full font-semibold hover:bg-primary/80 text-md disabled:cursor-not-allowed disabled:opacity-100"
            {loader}
            disabled={loader}
            on:click={updateProfile}>Update Profile</ButtonWithLoader
          >
        </form>
      </CardContent>
    </Card>
  </div>
{/if}
