<script lang="ts">
  import Users from "$lib/components/UserList/Users.svelte";
    import { isMobile } from "$lib/stores/is-mobile.store";
</script>
{#if !$isMobile}
<div
  class="flex p-10 lg:w-1/4"
>
  <!--<Users _profiles = {[]}/>-->
</div>
{/if}