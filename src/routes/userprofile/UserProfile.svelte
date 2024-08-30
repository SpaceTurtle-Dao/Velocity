<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/ui/card";
  import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/ui/avatar";
  import { Button } from "$lib/components/ui/ui/button";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/ui/tabs";
  import { BarChart3, Rocket, MessageCircle, Share2, TrendingUp } from "lucide-svelte";

  let profile = {
    username: '',
    displayName: '',
    bio: '',
    avatar: '',
  };

  let avatarPreview = '';

  function handleAvatarUpload(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarPreview = e.target?.result as string;
        profile.avatar = avatarPreview;
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit(event: Event) {
    event.preventDefault();
    console.log('Profile Created:', profile);
    // You can add logic here to send profile data to your server or state management
  }
</script>

<div class="max-w-4xl mx-auto p-4">
  <Card class="mb-8 overflow-hidden transition-all duration-300 hover:shadow-xl">
    <CardHeader class="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
      <CardTitle class="text-2xl">Create Your Profile</CardTitle>
    </CardHeader>
    <CardContent class="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg">
      <form on:submit={handleSubmit} class="space-y-4">
        <!-- Username -->
        <div class="space-y-2">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            bind:value={profile.username}
            placeholder="@username"
            class="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <!-- Display Name -->
        <div class="space-y-2">
          <label for="displayName" class="block text-sm font-medium text-gray-700">Display Name</label>
          <input
            type="text"
            id="displayName"
            bind:value={profile.displayName}
            placeholder="Your Display Name"
            class="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <!-- Bio -->
        <div class="space-y-2">
          <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            id="bio"
            bind:value={profile.bio}
            placeholder="Tell us something about yourself..."
            class="w-full p-2 border border-gray-300 rounded-md"
            required
          ></textarea>
        </div>

        <!-- Avatar Upload -->
        <div class="space-y-2">
          <label for="avatar" class="block text-sm font-medium text-gray-700">Profile Picture</label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            on:change={handleAvatarUpload}
            class="w-full p-2 border border-gray-300 rounded-md"
          />
          {#if avatarPreview}
            <div class="mt-4">
              <Avatar class="h-24 w-24 ring-4 ring-white">
                <AvatarImage src={avatarPreview} alt="Avatar Preview" />
                <AvatarFallback>{profile.displayName[0] || '?'}</AvatarFallback>
              </Avatar>
            </div>
          {/if}
        </div>

        <!-- Submit Button -->
        <Button type="submit" class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white transition-all duration-300">
          Create Profile
        </Button>
      </form>
    </CardContent>
  </Card>
</div>

<style>
  :global(body) {
    background-color: #FCE4EC;
  }
</style>
