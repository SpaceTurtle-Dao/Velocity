<script lang="ts">
import { eventsStore, type EventsStoresData } from '$lib/models/Event';

let events: EventsStoresData;

//@ts-ignore
eventsStore.subscribe(value => {
  events = value;
});

function getActionFromTags(tags: string[][]): string {
  const actionTag = tags.find(tag => tag[0] === 'Action');
  return actionTag ? actionTag[1] : 'Unknown';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}
export let followers = [];

</script>

<div class="events-list">
  <h1>Events</h1>
  {#each events as event (event.id)}
    <div class="event-item">
      <h2>{getActionFromTags(event.tags)}</h2>
      <p>{event.content}</p>
      <small>Created at: {formatDate(event.created_at)} by {event.pubkey}</small>
    </div>
  {/each}
</div>

<style>
.events-list {
  max-width: 800px;
  margin: 0 auto;
}

.event-item {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
}

h1 {
  text-align: center;
}

h2 {
  margin-top: 0;
}

small {
  color: #666;
}
</style>


<div class="p-4 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold text-purple-600 mb-4">Followers</h2>
  <ul class="space-y-2">
    {#each followers as follower}
      <li class="p-3 bg-gray-100 rounded-lg shadow-sm">{follower}</li>
    {/each}
  </ul>
</div>
