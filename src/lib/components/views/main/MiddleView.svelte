<div
  class="max-w-[653px] h-screen w-full scrollbar-hidden overflow-y-auto md:pr-5 lg:pr-0"
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
