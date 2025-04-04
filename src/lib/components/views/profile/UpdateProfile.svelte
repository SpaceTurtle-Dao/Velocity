<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { z } from "zod";
  import type { Profile, UserInfo } from "$lib/models/Profile";
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
  import { event, fetchEvents } from "$lib/ao/relay";
  import { upload } from "$lib/ao/uploader";
  import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";
  import { registryService } from "$lib/services/RegistryService";
  import { addressStore } from "$lib/stores/address.store";
  import { profileService } from "$lib/services/ProfileService";

  let initialProfile: Profile | undefined;
  let hubId: string;

  // Zod schema for profile validation
  const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    display_name: z.string().min(1, "Display Name is required"),
    about: z.string().optional(),
    picture: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
    banner: z.string().optional(),
    bot: z.boolean().optional(),
  });

  type ProfileSchemaType = z.infer<typeof profileSchema>;

  let profile: ProfileSchemaType = {
    name: initialProfile?.userName || "",
    display_name: initialProfile?.displayName || "",
    about: initialProfile?.about || "",
    picture: initialProfile?.thumbnail || "",
    website: initialProfile?.website || "",
    bot: initialProfile?.bot || false,
  };

  let userInfo: UserInfo;
  let errors: Partial<Record<keyof ProfileSchemaType, string>> = {};

  let pictureFile: File | null = null;
  let bannerFile: File | null = null;
  let loader = false;

  const dispatch = createEventDispatcher();

  function handleFileChange(event: Event, type: "picture" | "banner") {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      if (type === "picture") {
        pictureFile = file;
      } else {
        bannerFile = file;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        profile[type] = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async function updateProfile() {
    if (!initialProfile) return;
    loader = true;
    try {
      profileSchema.parse(profile);
      errors = {};

      if (pictureFile) {
        let _pictureFile = await upload(pictureFile);
        profile.picture = _pictureFile.url;
      }
      if (bannerFile) {
        let _bannerFile = await upload(bannerFile);
        profile.banner = _bannerFile.url;
      }

      const updated_at = Date.now();

      const content = JSON.stringify({
        name: profile.name,
        display_name: profile.display_name,
        about: profile.about,
        dateCreated: initialProfile?.dateCreated,
        updated_at,
        thumbnail: profile.picture,
        website: profile.website,
        coverImage: profile.banner,
        bot: profile.bot,
      });

      const tags = [
        { name: "Kind", value: "0" },
        { name: "Content", value: content },
      ];

      try {
        if ($addressStore.address) {
          let data = {
            userName: profile.name,
            displayName: profile.display_name,
            description: profile.about,
            thumbnail: profile.picture,
            coverImage: profile.banner,
          };
          const result = await profileService.update(
            data,
            initialProfile.id,
          );
          await profileService.get($addressStore.address)
          // let _currentUser = await fetchEvents(userInfo.Process);
          // currentUser.set(_currentUser);
          // user.set(_currentUser)

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

  onMount(async () => {
    // If you need to do any initialization with the initial profile data
    if ($addressStore.address) {
      hubId = (await registryService.getZoneById($addressStore.address)).spec
        .processId;
      initialProfile = await profileService.get($addressStore.address);
    }
  });
</script>

{#if initialProfile}
  <div class="mx-auto max-w-2xl p-4">
    <Card class="w-full relative border border-border rounded-lg">
      <CardHeader>
        <CardTitle>Update Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form on:submit|preventDefault={() => {}} class="space-y-6">
          <div class="relative mb-16">
            <div class="h-32 bg-gray-200 relative">
              {#if profile.banner}
                <img
                  src={profile.banner}
                  alt="Banner"
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
                  <AvatarImage src={profile.picture} alt={profile.name} />
                  <AvatarFallback
                    >{profile.name
                      ? profile.name[0].toUpperCase()
                      : "U"}</AvatarFallback
                  >
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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="name">Name *</Label>
              <Input id="name" bind:value={profile.name} />
              {#if errors.name}
                <p class="text-red-500 text-sm">{errors.name}</p>
              {/if}
            </div>

            <div class="space-y-2">
              <Label for="display_name">Display Name *</Label>
              <Input id="display_name" bind:value={profile.display_name} />
              {#if errors.display_name}
                <p class="text-red-500 text-sm">
                  {errors.display_name}
                </p>
              {/if}
            </div>
          </div>

          <div class="space-y-2">
            <Label for="about">About</Label>
            <Textarea id="about" bind:value={profile.about} rows={3} />
          </div>

          <div class="space-y-2">
            <Label for="website">Website</Label>
            <Input id="website" type="url" bind:value={profile.website} />
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
