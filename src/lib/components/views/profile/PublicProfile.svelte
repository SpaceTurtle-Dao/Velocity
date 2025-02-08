<script lang="ts">
import { Card, CardContent } from "$lib/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
import { Link, CalendarDays } from "lucide-svelte";
import * as Tabs from "$lib/components/ui/tabs/index.js";
import Post from "$lib/components/posts/Post.svelte";
import { fetchEvents, fetchProfiles } from "$lib/ao/relay";
import { getDisplayUrl } from "$lib/utils/url.utils";
import { formatJoinedTimestamp } from "$lib/utils/timestamp.utils";
import type { Profile } from "$lib/models/Profile";

export let params: { address?: string } = {};
let profile: Profile;
let events: Array<Event> = [];
let value = "post";

async function loadProfile() {
  if (params?.address) {
    const profiles = await fetchProfiles([params.address]);
    if (profiles.length > 0) {
      profile = profiles[0];
      await fetchPost();
    }
    console.log("Profile from Pubic",profiles);
  }
}

async function fetchPost() {
  if (profile) {
    const filter = JSON.stringify([
      {
        kinds: ["1", "6"],
        since: 1663905355000,
        until: Date.now(),
        limit: 100,
        tags: { marker: ["root"] }
      },
      {
        tags: { From: [profile.address] }
      }
    ]);
    events = await fetchEvents(filter);
    console.log("Events from Relay", events);
  }
}

$: {
  if (params.address) {
    loadProfile();
  }
}
</script>

{#if profile}
<div class="md:mt-10 max-w-prose">
  <Card class="mb-10 overflow-hidden shadow-lg rounded-none md:rounded-lg border-border relative">
    <div class="relative mb-10">
      <div class="bg-gray-200 relative">
        {#if profile?.banner}
          <img src={profile.banner} alt="Banner" class="w-full max-h-48 object-cover"/>
        {:else}
          <div class="w-full h-32 object-cover bg-secondary" />
        {/if}
      </div>
      <div class="absolute bottom-0 left-4 transform translate-y-1/3">
        <Avatar class="w-24 h-24 border-4 border-white">
          {#if profile?.picture}
            <AvatarImage src={profile.picture} alt={profile.name} />
          {/if}
          <AvatarFallback>{profile.name ? profile.name[0].toUpperCase() : "U"}</AvatarFallback>
        </Avatar>
      </div>
    </div>

    <CardContent>
      <p class="font-bold text-2xl">{profile.name}</p>
      <p class="text-muted-foreground">@{profile.display_name}</p>
      {#if profile.about}
        <p class="pt-2.5">{profile.about}</p>
      {/if}
      <div class="flex flex-row space-x-5 pt-2.5">
        {#if profile.website}
          <div class="flex flex-row space-x-1 justify-end items-center">
            <Link size={16} />
            <a href={profile.website} target="_blank" rel="noopener noreferrer" class="text-blue-400">
              {getDisplayUrl(profile.website)}
            </a>
          </div>
        {/if}
        <div class="flex flex-row space-x-1 justify-end items-center text-muted-foreground">
          <CalendarDays size={16} />
          <p>Joined {formatJoinedTimestamp(profile.created_at)}</p>
        </div>
      </div>
    </CardContent>
  </Card>

  <Tabs.Root bind:value class="max-w-prose">
    <Tabs.List class="grid grid-cols-1">
      <Tabs.Trigger value="post">Posts</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="post">
      <div>
        {#each events as event}
          <div class="border border-border max-w-prose">
            <Post {event} />
          </div>
        {/each}
      </div>
    </Tabs.Content>
  </Tabs.Root>
</div>
{/if}