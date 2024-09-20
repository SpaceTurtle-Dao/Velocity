<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Event } from '$lib/models/Event';
  import type { Profile, UserInfo } from '$lib/models/Profile';
  import { currentUser, userRelay } from '../../../../stores/profile.store';
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";

  let profile: Profile = {
    name: '',
    about: '',
    picture: '',
    display_name: '',
    website: '',
    banner: '',
    bot: false,
  };

  let userInfo: UserInfo;

  currentUser.subscribe(value => {
    userInfo = value;
    // Remove this block to prevent loading existing profile data
    // if (userInfo.Profile && userInfo.Profile.kind === 0) {
    //   profile = JSON.parse(userInfo.Profile.content);
    // }
  });

  let pictureFile: File | null = null;
  let bannerFile: File | null = null;

  const dispatch = createEventDispatcher();

  function handleFileChange(event: Event, type: 'picture' | 'banner') {
    //@ts-ignore
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      if (type === 'picture') {
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

  async function createProfile() {
    // Handle file uploads here (e.g., to a server or IPFS)
    if (pictureFile) {
      // Simulating file upload and getting a URL
      profile.picture = URL.createObjectURL(pictureFile);
    }
    if (bannerFile) {
      // Simulating file upload and getting a URL
      profile.banner = URL.createObjectURL(bannerFile);
    }

    const content = JSON.stringify(profile);

    const event: Omit<Event, 'id' | 'sig'> = {
      pubkey: userInfo.Token,
      created_at: Math.floor(Date.now() / 1000),
      kind: 0,
      tags: [],
      content: content
    };

    const serialized = JSON.stringify([
      0,
      event.pubkey,
      event.created_at,
      event.kind,
      event.tags,
      event.content
    ]);

    const eventId = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(serialized));
    const idHex = Array.from(new Uint8Array(eventId))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const fullEvent: Event = {
      ...event,
      id: idHex,
    };

    console.log('Profile creation event:', fullEvent);

    userInfo.Profile = fullEvent;
    currentUser.set(userInfo);

    dispatch('profileCreated', profile);

    // Uncomment this when ready to publish to relay
    // if ($userRelay) {
    //   const relayConnection = await connectToRelay($userRelay);
    //   await relayConnection.publish(fullEvent);
    // }
  }
</script>

<div class="container mx-auto max-w-2xl p-4">
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Create Your Profile</CardTitle>
    </CardHeader>
    <CardContent>
      <form on:submit|preventDefault={createProfile} class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="picture">Profile Picture</Label>
            <div class="flex items-center space-x-4">
              <Avatar class="w-16 h-16">
                <AvatarImage src={profile.picture} alt={profile.name} />
                <AvatarFallback>{profile.name ? profile.name[0].toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <Input id="picture" type="file" accept="image/*" on:change={(e) => 
              //@ts-ignore
              handleFileChange(e, 'picture')} />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="banner">Banner Image</Label>
            <Input id="banner" type="file" accept="image/*" on:change={(e) => 
            //@ts-ignore
            handleFileChange(e, 'banner')} />
            {#if profile.banner}
              <img src={profile.banner} alt="Banner" class="w-full h-32 object-cover rounded" />
            {/if}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="name">Name</Label>
            <Input id="name" bind:value={profile.name} />
          </div>

          <div class="space-y-2">
            <Label for="display_name">Display Name</Label>
            <Input id="display_name" bind:value={profile.display_name} />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="about">About</Label>
          <Textarea id="about" bind:value={profile.about} rows="3" />
        </div>

        <div class="space-y-2">
          <Label for="website">Website</Label>
          <Input id="website" type="url" bind:value={profile.website} />
        </div>

        <Button type="submit" class="w-full">Create Profile</Button>
      </form>
    </CardContent>
  </Card>
</div>