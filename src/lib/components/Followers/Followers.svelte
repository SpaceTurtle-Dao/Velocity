<script lang="ts">
  import { followers } from "$lib/stores/profile.store";
  import { profileFromEvent, type UserInfo, type Profile } from "$lib/models/Profile";
  import ProfileCard from "$lib/components/views/profile/ProfileCard.svelte";
  import { fetchEvents} from "$lib/ao/relay";
  import { profileService } from "$lib/services/ProfileService";
  import { addressStore } from "$lib/stores/address.store";
  import { onMount } from "svelte";
    import { registryService } from "$lib/services/RegistryService";

  let userProfiles: Array<Profile> = [];
  let isLoading = false;
  let error: string | null = null;
  let hubId: string;

  // Add function to initialize hubId
  async function initializeHubId() {
    if ($addressStore.address) {
      hubId = (await registryService.getZoneById($addressStore.address)).spec.processId;
    }
  }

  // Function to fetch kind 0 events (user metadata)
  async function fetchProfileEvents(addresses: string[]): Promise<any[]> {
    if (!hubId) {
      await initializeHubId();
    }
    
    const filter = {
      kinds: ["0"],
      authors: addresses,
      limit: 100,
      since: 0,
      until: Date.now()
    };
    
    return await fetchEvents(hubId, JSON.stringify([filter]));
  }

  // Update other fetch functions to ensure hubId is available
  async function fetchUserSubscriptions(address: string): Promise<number> {
    if (!hubId) {
      await initializeHubId();
    }

    try {
      const filter = {
        kinds: ["3"],
        authors: [address],
      };
      
      const events = await fetchEvents(hubId, JSON.stringify([filter]));
      if (!events || !events.length) return 0;
      
      return events[0].Tags.filter((tag: string[]) => tag[0] === 'p').length;
    } catch (e) {
      console.error('Error fetching subscriptions:', e);
      return 0;
    }
  }

  async function fetchUserEvents(address: string): Promise<number> {
    if (!hubId) {
      await initializeHubId();
    }

    try {
      const filter = {
        authors: [address],
        limit: 1,
        kinds: ["1", "6"]
      };
      
      const events = await fetchEvents(hubId, JSON.stringify([filter]));
      return events?.length || 0;
    } catch (e) {
      console.error('Error fetching event count:', e);
      return 0;
    }
  }

  async function fetchUserSubs(address: string): Promise<number> {
    if (!hubId) {
      await initializeHubId();
    }

    try {
      const filter = {
        kinds: ["3"],
        '#p': [address],
        limit: 100
      };
      
      const events = await fetchEvents(hubId, JSON.stringify([filter]));
      return events?.length || 0;
    } catch (e) {
      console.error('Error fetching subs:', e);
      return 0;
    }
  }

  // Main function to process followers
  async function processFollowers(_followers: string[]) {
    if (!hubId) {
      await initializeHubId();
    }

    isLoading = true;
    error = null;
    
    try {
      const profileEvents = await fetchProfileEvents(_followers);
      
      /*const enrichedProfiles = await Promise.all(
        profileEvents.map(async (event) => {
          try {
            const profile = profileFromEvent(event);
            const address = event.PubKey;
            
            const [events, subs, subscriptions] = await Promise.all([
              fetchUserEvents(address),
              fetchUserSubs(address),
              fetchUserSubscriptions(address)
            ]);

            const userInfo: UserInfo = {
              Events: events,
              Profile: profile,
              Subs: subs,
              Subscriptions: subscriptions,
              CreatedAt: event.CreatedAt
            };

            return userInfo;
          } catch (e) {
            console.error('Error processing profile:', e);
            return null;
          }
        })
      );*/

      //userProfiles = await fetchProfiles([]);
      console.log('Processed profiles:', userProfiles);
      
    } catch (e) {
      console.error('Error processing followers:', e);
      error = 'Failed to load profiles. Please try again later.';
    } finally {
      isLoading = false;
    }
  }

  // Subscribe to followers store changes
  followers.subscribe((_followers) => {
    if (_followers && _followers.length > 0) {
      processFollowers(_followers);
    }
  });

  // Initialize hubId when component mounts
  onMount(async () => {
    await initializeHubId();
  });

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  function toUrl(tx: string) {
    return `https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/${tx}`;
  }
</script>

<div class="flex flex-col space-y-2">
  {#if isLoading}
    <div class="text-center py-4">Loading profiles...</div>
  {:else if error}
    <div class="text-red-500 text-center py-4">{error}</div>
  {:else}
    {#each userProfiles as userProfile}
      {#if userProfile?.address}
        <ProfileCard address={userProfile.address} />
      {/if}
    {/each}
  {/if}
</div>