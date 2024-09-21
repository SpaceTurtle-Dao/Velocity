<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { z } from "zod";
  import type { Event } from "$lib/models/Event";
  import type { UserInfo } from "$lib/models/Profile";
  import { currentUser } from "$lib/stores/profile.store";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { spawnRelay, relay, event as _event } from "$lib/ao/relay";
  import { walletAddress } from "$lib/stores/walletStore";

  // Zod schema for initial profile validation
  const initialProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    display_name: z.string().min(1, "Display Name is required"),
  });

  type InitialProfileSchemaType = z.infer<typeof initialProfileSchema>;

  let profile: InitialProfileSchemaType = {
    name: "",
    display_name: "",
  };

  let userInfo: UserInfo;
  let errors: Partial<Record<keyof InitialProfileSchemaType, string>> = {};

  currentUser.subscribe((value) => {
    userInfo = value;
  });

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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

      const event = {
        kind: 0, // Kind 0 is for metadata events in Nostr
        tags: [], // Metadata events typically don't have tags
        content: content,
      };

      const serialized = JSON.stringify(event);

      try {
        await spawnRelay();
        //wait sometime to fetch relay
        await sleep(5000);
        const address = await window.arweaveWallet.getActiveAddress();
        let _relay = await relay(address);
        console.log(address)
        console.log("relay")
        console.log(_relay)
        await _event(serialized, _relay!);
      } catch (error) {
        console.error("Error creating profile:", error);
        // Handle error (e.g., show error message to user)
      }
    } catch (err) {}
  }
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <Button
      class="w-44 h-12 bg-primary text-secondary rounded-full py-3 font-bold text-lg hover:bg-ring transition-colors duration-200 flex items-center justify-center "
      >Create Profile</Button
    >
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title class="text-primary">Create Your Profile</Dialog.Title>
    </Dialog.Header>
    <form on:submit|preventDefault={createProfile} class="space-y-6">
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
        <Label for="display_name" class="text-lg font-medium text-primary"
          >Display Name</Label
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
      <Dialog.Footer>
        <div class="flex w-full justify-center">
          <Button class="w-48 self-center" type="submit">Create Profile</Button>
        </div>
      </Dialog.Footer>
    </form></Dialog.Content
  >
</Dialog.Root>
