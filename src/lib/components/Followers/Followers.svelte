<script lang="ts">
  import { followers } from "$lib/stores/profile.store";
  import { profileFromEvent, type UserInfo, type Profile } from "$lib/models/Profile";
  import ProfileCard from "$lib/components/views/profile/ProfileCard.svelte";
  import { fetchEvents } from "$lib/ao/relay";

  let userProfiles: Array<UserInfo> = [];
  let isLoading = false;
  let error: string | null = null;

  // Function to fetch kind 0 events (user metadata)
  async function fetchProfileEvents(addresses: string[]): Promise<any[]> {
    const filter = {
      kinds: ["0"],  // kind 0 for metadata
      authors: addresses,
      limit: 100,
      since: 0,
      until: Date.now()
    };
    
    return await fetchEvents(JSON.stringify([filter]));
  }

  // Function to fetch user subscriptions (kind 3 events)
  async function fetchUserSubscriptions(address: string): Promise<number> {
    try {
      const filter = {
        kinds: ["3"],
        authors: [address],
        // limit: 1
      };
      
      const events = await fetchEvents(JSON.stringify([filter]));
      if (!events || !events.length) return 0;
      
      // Count p tags in the latest kind 3 event
      return events[0].Tags.filter((tag: string[]) => tag[0] === 'p').length;
    } catch (e) {
      console.error('Error fetching subscriptions:', e);
      return 0;
    }
  }

  // Function to fetch user events count
  async function fetchUserEvents(address: string): Promise<number> {
    try {
      const filter = {
        authors: [address],
        limit: 1,
        kinds: ["1", "6"]  // Regular posts and reposts
      };
      
      const events = await fetchEvents(JSON.stringify([filter]));
      return events?.length || 0;
    } catch (e) {
      console.error('Error fetching event count:', e);
      return 0;
    }
  }

  // Function to fetch user subscribers count
  async function fetchUserSubs(address: string): Promise<number> {
    try {
      const filter = {
        kinds: ["3"],
        '#p': [address],
        limit: 100
      };
      
      const events = await fetchEvents(JSON.stringify([filter]));
      return events?.length || 0;
    } catch (e) {
      console.error('Error fetching subs:', e);
      return 0;
    }
  }

  // Main function to process followers and build UserInfo objects
  async function processFollowers(_followers: string[]) {
    isLoading = true;
    error = null;
    
    try {
      // Fetch profile events for all followers
      const profileEvents = await fetchProfileEvents(_followers);
      
      // Process each profile event and gather additional data
      const enrichedProfiles = await Promise.all(
        profileEvents.map(async (event) => {
          try {
            const profile = profileFromEvent(event);
            const address = event.PubKey;
            
            // Fetch additional user data in parallel
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
      );

      userProfiles = enrichedProfiles.filter((profile): profile is UserInfo => profile !== null);
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
      <ProfileCard data={userProfile} />
    {/each}
  {/if}
</div>