<script lang="ts">
  import type { UserInfo } from "$lib/models/Profile";
  import { subscriptions } from "../../../../stores/profile.store";
  export let _subscribtions: Array<UserInfo> = [];

  //@ts-ignore
  subscriptions.subscribe((value) => {
    _subscribtions = value;
  });

</script>

<div class="p-4 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold text-pink-600 mb-4">Following</h2>
  <ul class="space-y-2">
    {#each _subscribtions as subscribtion}
      <li class="p-3 bg-gray-100 rounded-lg shadow-sm">{subscribtion.Profile.pubkey}</li>
    {/each}
  </ul>
</div>
