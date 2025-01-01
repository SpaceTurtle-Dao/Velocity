<script lang="ts">
</script>

<div class="h-screen w-full lg:w-1/3 xl:w-2/4 overflow-auto scrollbar-hidden px-2 lg:px-0">
  <slot />
</div>

<style>
  .scrollbar-hidden {
    scrollbar-width: none;
  }
  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }
</style>