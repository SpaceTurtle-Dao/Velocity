<script lang="ts">
  import { onMount } from "svelte";
  import { z } from "zod";
  import type { Profile } from "$lib/models/Profile";
  import { user } from "$lib/stores/profile.store";
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
  import { currentUser } from "$lib/stores/current-user.store";
  import { addressStore } from "$lib/stores/address.store";

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

  // currentUser.subscribe((value) => {
  //   userInfo = value;
  // });

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
    isLoading = true;
    try {
      // Check if user already exists
      if (userInfo) {
        handleExistingUser();
        isLoading = false;
        return;
      }

      // Validate the profile data
      signupSchema.parse(profile);
      errors = {};

      isUploading = true;
      // Handle file uploads if they exist
      if (pictureFile) {
        let _pictureFile = await upload(pictureFile);
        profile.picture = _pictureFile.url;
      }
      if (bannerFile) {
        let _bannerFile = await upload(bannerFile);
        profile.banner = _bannerFile.url;
      }
      isUploading = false;

      const created_at = Date.now();
      // Prepare the content for the event
      const content = JSON.stringify({
        name: profile.name,
        display_name: profile.display_name,
        about: profile.about,
        created_at,
        picture: profile.picture,
        banner: profile.banner,
        website: profile.website,
      });

      const tags: Array<Tag> = [
        { name: "Kind", value: "0" },
        { name: "Content", value: content },
      ];

      try {
        // _relay = await spawnRelay();
        // console.log("Got Relay " + _relay);
        await event(tags);

        const { address } = $addressStore;

        if (address) {
          currentUser.set({
            name: profile.name,
            about: profile.about,
            created_at,
            picture: profile.picture,
            display_name: profile.display_name,
            banner: profile.banner,
            website: profile.website,
            bot: false,
            address: address,
            followList: [],
          });
        }
        // await setRelay(_relay!);

        // Fetch updated user info
        // const _currentUser = await info(_relay);
        // currentUser.set(_currentUser);
        // user.set(_currentUser);

        isLoading = false;
        push("/feed");
      } catch (error) {
        console.error("Error creating profile:", error);
        isLoading = false;
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log(err);
        errors = err.flatten().fieldErrors as Partial<
          Record<keyof SignupSchemaType, string>
        >;
      }
      isLoading = false;
    }
  }

  async function checkExistingUser() {
    try {
      if (userInfo) {
        replace("/feed");
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  }

  onMount(() => {
    checkExistingUser();
  });
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title class="text-primary">Profile Already Exists</Dialog.Title>
    </Dialog.Header>
    <div class="p-6">
      <p class="text-center mb-4">
        You already have a profile. Would you like to go to your feed?
      </p>
      <div class="flex justify-center space-x-4">
        <Button variant="outline" on:click={() => (isOpen = false)}>
          Cancel
        </Button>
        <Button variant="default" on:click={() => push("/feed")}>
          Go to Feed
        </Button>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>

<div
  class="min-h-screen bg-background flex flex-col items-center justify-center p-4"
>
  <Card class="w-full max-w-md">
    <CardHeader>
      <CardTitle class="text-2xl font-bold text-center text-primary">
        Create Your Velocity Account
      </CardTitle>
    </CardHeader>
    <CardContent>
      <form on:submit|preventDefault={() => {}} class="space-y-6">
        <!-- Banner Upload -->
        <div class="relative h-32 mb-16 rounded-lg overflow-hidden">
          <div class="h-full bg-gray-200">
            {#if profile.banner}
              <img
                src={profile.banner}
                alt="Banner"
                class="w-full h-full object-cover"
              />
            {/if}
          </div>
          <label
            for="banner"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer hover:bg-opacity-60 transition-opacity"
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

        <!-- Profile Picture Upload -->
        <div class="flex justify-center -mt-20 mb-6">
          <div class="relative">
            <Avatar class="w-24 h-24 border-4 border-background">
              <AvatarImage src={profile.picture} alt={profile.name} />
              <AvatarFallback>
                {profile.name ? profile.name[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <label
              for="picture"
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer hover:bg-opacity-60 transition-opacity"
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

        <div class="space-y-2">
          <Label for="name">Name *</Label>
          <Input
            id="name"
            bind:value={profile.name}
            placeholder="Enter your name"
            disabled={isLoading}
          />
          {#if errors.name}
            <p class="text-red-500 text-sm">{errors.name}</p>
          {/if}
        </div>

        <div class="space-y-2">
          <Label for="display_name">Display Name *</Label>
          <Input
            id="display_name"
            bind:value={profile.display_name}
            placeholder="Enter your display name"
            disabled={isLoading}
          />
          {#if errors.display_name}
            <p class="text-red-500 text-sm">
              {errors.display_name}
            </p>
          {/if}
        </div>

        <div class="space-y-2">
          <Label for="about">About</Label>
          <Input
            id="about"
            bind:value={profile.about}
            placeholder="Tell us about yourself"
            disabled={isLoading}
          />
        </div>

        <div class="space-y-2">
          <Label for="website">Website</Label>
          <Input
            id="website"
            bind:value={profile.website}
            placeholder="https://example.com"
            disabled={isLoading}
          />
          {#if errors.website}
            <p class="text-red-500 text-sm">{errors.website}</p>
          {/if}
        </div>

        <ButtonWithLoader
          on:click={handleSignup}
          loader={isLoading}
          class="w-full relative"
          disabled={isLoading}
          >Create Account
        </ButtonWithLoader>
      </form>
    </CardContent>
  </Card>
</div>
