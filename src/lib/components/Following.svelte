<script lang="ts">
  export let following = [];
</script>

<div class="p-4 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold text-pink-600 mb-4">Following</h2>
  <ul class="space-y-2">
    {#each following as user}
      <li class="p-3 bg-gray-100 rounded-lg shadow-sm">{user}</li>
    {/each}
  </ul>
</div>
