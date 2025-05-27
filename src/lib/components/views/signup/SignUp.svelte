<script lang="ts">
  import { onMount } from "svelte";
  import { z } from "zod";
  import type { Profile } from "$lib/models/Profile";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Button } from "$lib/components/ui/button";
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
  import { event } from "$lib/ao/relay";
  import { upload } from "$lib/ao/uploader";
  import { push, replace } from "svelte-spa-router";
  import type { Tag } from "$lib/models/Tag";
  import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import { currentUser } from "$lib/services/CurrentUser";

  // Zod schema for signup validation
  const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    display_name: z.string().min(1, "Display Name is required"),
    about: z.string().optional(),
    picture: z.string().optional(),
    banner: z.string().optional(),
    website: z.string().optional(),
  });

  type SignupSchemaType = z.infer<typeof signupSchema>;

  let profile: SignupSchemaType = {
    name: "",
    display_name: "",
    about: "",
    picture: "",
    banner: "",
    website: "",
  };

  let isLoading = false;
  let isUploading = false;
  let isOpen = false;
  let errors: Partial<Record<keyof SignupSchemaType, string>> = {};
  let pictureFile: File | null = null;
  let bannerFile: File | null = null;
  let _relay: string | undefined;
  let userInfo: Profile;

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

  async function handleExistingUser() {
    isOpen = true;
  }

  async function handleSignup() {
   
  }

</script>

<div class="h-screen overflow-auto">
  <div
    class="overflow-y-auto min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 md:p-8"
  >
    <Card class="w-full max-w-md mx-auto shadow-lg">
      <CardHeader class="space-y-2">
        <CardTitle
          class="text-2xl sm:text-3xl font-bold text-center text-primary"
        >
          Create Your Velocity Account
        </CardTitle>
        <p class="text-center text-muted-foreground">
          Fill in your details to get started
        </p>
      </CardHeader>

      <CardContent>
        <form on:submit|preventDefault={() => {}} class="space-y-6">
          <!-- Enhanced Banner Upload -->
          <div class="space-y-2">
            <div
              class="relative h-32 sm:h-40 rounded-lg overflow-hidden transition-all duration-300 group"
            >
              <div class="h-full bg-muted flex items-center justify-center">
                {#if profile.banner}
                  <img
                    src={profile.banner}
                    alt="Banner"
                    class="w-full h-full object-cover transition-opacity duration-300"
                  />
                {:else}
                  <div class="text-center p-4">
                    <Camera
                      size={24}
                      class="mx-auto mb-2 text-muted-foreground"
                    />
                    <p class="text-sm text-muted-foreground">
                      Upload a banner image
                    </p>
                  </div>
                {/if}
              </div>
              <label
                for="banner"
                class="absolute inset-0 flex flex-col items-center justify-center bg-black/50 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <Camera size={24} class="text-white mb-2" />
                <span class="text-white text-sm">Upload a banner image</span>
              </label>
              <Input
                id="banner"
                type="file"
                accept="image/*"
                class="hidden"
                on:change={(e) => handleFileChange(e, "banner")}
              />
            </div>
          </div>

          <!-- Enhanced Profile Picture Upload -->
          <div class="flex flex-col items-center -mt-16 mb-8">
            <div class="relative group">
              <Avatar
                class="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-lg"
              >
                <AvatarImage src={profile.picture} alt={profile.name} />
                <AvatarFallback class="bg-muted">
                  {#if profile.picture}
                    <img
                      src={profile.picture}
                      alt="Profile"
                      class="w-full h-full object-cover"
                    />
                  {:else}
                    <div
                      class="flex items-center justify-center w-full h-full text-muted-foreground"
                    >
                      <Camera size={20} />
                    </div>
                  {/if}
                </AvatarFallback>
              </Avatar>
              <label
                for="picture"
                class="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <Camera size={20} class="text-white mb-1" />
                <span class="text-white text-xs">Upload</span>
              </label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                class="hidden"
                on:change={(e) => handleFileChange(e, "picture")}
              />
            </div>
            <span class="text-sm text-muted-foreground mt-2"
              >Profile picture</span
            >
          </div>
          <div class="grid gap-6">
            <div class="space-y-2">
              <Label for="name" class="text-sm font-medium">Name *</Label>
              <Input
                id="name"
                bind:value={profile.name}
                placeholder="Enter your name"
                disabled={isLoading}
                class="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              {#if errors.name}
                <p class="text-destructive text-sm mt-1">{errors.name}</p>
              {/if}
            </div>

            <div class="space-y-2">
              <Label for="display_name" class="text-sm font-medium"
                >Display Name *</Label
              >
              <Input
                id="display_name"
                bind:value={profile.display_name}
                placeholder="Enter your display name"
                disabled={isLoading}
                class="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              {#if errors.display_name}
                <p class="text-destructive text-sm mt-1">
                  {errors.display_name}
                </p>
              {/if}
            </div>

            <div class="space-y-2">
              <Label for="about" class="text-sm font-medium">About</Label>
              <Input
                id="about"
                bind:value={profile.about}
                placeholder="Tell us about yourself"
                disabled={isLoading}
                class="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div class="space-y-2">
              <Label for="website" class="text-sm font-medium">Website</Label>
              <Input
                id="website"
                bind:value={profile.website}
                placeholder="https://example.com"
                disabled={isLoading}
                class="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              {#if errors.website}
                <p class="text-destructive text-sm mt-1">{errors.website}</p>
              {/if}
            </div>
          </div>

          <ButtonWithLoader
            on:click={handleSignup}
            loader={isLoading}
            class="w-full relative mt-8 transition-all duration-200 hover:opacity-90"
            disabled={isLoading}
          >
            Create Account
          </ButtonWithLoader>
        </form>
      </CardContent>
    </Card>
  </div>
</div>
