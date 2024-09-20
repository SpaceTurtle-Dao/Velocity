<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { z } from 'zod';
  import type { Event } from '$lib/models/Event';
  import type { UserInfo } from '$lib/models/Profile';
  import { currentUser } from '../../../../stores/profile.store';
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";

  // Zod schema for initial profile validation
  const initialProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    display_name: z.string().min(1, "Display Name is required"),
  });

  type InitialProfileSchemaType = z.infer<typeof initialProfileSchema>;

  let profile: InitialProfileSchemaType = {
    name: '',
    display_name: '',
  };

  let userInfo: UserInfo;
  let errors: Partial<Record<keyof InitialProfileSchemaType, string>> = {};

  currentUser.subscribe(value => {
    userInfo = value;
  });

  const dispatch = createEventDispatcher();

  async function createProfile() {
    try {
      // Validate the profile data
      initialProfileSchema.parse(profile);
      errors = {};

      // Prepare the content for the event
      const content = JSON.stringify({
        name: profile.name,
        display_name: profile.display_name,
      });

      const event: Omit<Event, 'id'> = {
        pubkey: userInfo.Token,
        created_at: Math.floor(Date.now() / 1000),
        kind: 0, // Kind 0 is for metadata events in Nostr
        tags: [], // Metadata events typically don't have tags
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
        id: idHex
      };

      console.log('Profile creation event:', fullEvent);

      try {
        // Simulating backend call using fetch API
        const response = await fetch('/api/create-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fullEvent),
        });

        if (!response.ok) {
          throw new Error('Failed to create profile');
        }

        const result = await response.json();
        console.log('Profile created successfully:', result);

        dispatch('profileCreated', profile);
      } catch (error) {
        console.error('Error creating profile:', error);
        // Handle error (e.g., show error message to user)
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        errors = err.flatten().fieldErrors as Partial<Record<keyof InitialProfileSchemaType, string>>;
      } else {
        console.error('Unexpected error:', err);
      }
    }
  }
</script>

<div class="container mx-auto max-w-md p-4">
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="text-2xl font-bold text-center">Create Your Profile</CardTitle>
    </CardHeader>
    <CardContent>
      <form on:submit|preventDefault={createProfile} class="space-y-6">
        <div class="space-y-2">
          <Label for="name" class="text-lg font-medium">Name *</Label>
          <Input id="name" bind:value={profile.name} placeholder="Enter your name" class="w-full p-2 border rounded" />
          {#if errors.name}
            <p class="text-red-500 text-sm">{errors.name}</p>
          {/if}
        </div>

        <div class="space-y-2">
          <Label for="display_name" class="text-lg font-medium">Display Name *</Label>
          <Input id="display_name" bind:value={profile.display_name} placeholder="Enter your display name" class="w-full p-2 border rounded" />
          {#if errors.display_name}
            <p class="text-red-500 text-sm">{errors.display_name}</p>
          {/if}
        </div>

        <Button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
          Create Profile
        </Button>
      </form>
    </CardContent>
  </Card>
</div>