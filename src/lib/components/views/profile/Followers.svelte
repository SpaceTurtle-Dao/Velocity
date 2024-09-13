<script lang="ts">
  export let followers = [];
</script>

<div class="p-4 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold text-purple-600 mb-4">Followers</h2>
  <ul class="space-y-2">
    {#each followers as follower}
      <li class="p-3 bg-gray-100 rounded-lg shadow-sm">{follower}</li>
    {/each}
  </ul>
</div>
