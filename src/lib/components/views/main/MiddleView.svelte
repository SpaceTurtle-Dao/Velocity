<script lang="ts">
  import { isMobile } from "$lib/stores/is-mobile.store";

  // 49px MobileTopView 53px MobileBottomNavBar
</script>

<div
  class="max-w-[653px] w-full scrollbar-hidden overflow-y-auto md:pr-5 lg:pr-0 {$isMobile
    ? 'h-[calc(100vh-49px-53px)]'
    : 'h-screen'}"
>
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
