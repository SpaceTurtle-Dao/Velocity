<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar";

  export let src: string;
  export let name: string;

  function getInitials(name: string): string {
    return name.slice(0, 1).toUpperCase();
  }

  export let size: "sm" | "base" | "lg" | "xl" = "base";

  // Compute the class based on the size
  const sizeClass = {
    sm: "w-8 h-8", // 32px
    base: "w-10 h-10", // 40px
    lg: "w-12 h-12", // 48px
    xl: "w-16 h-16", // 64px
  }[size];
</script>

<Avatar.Root class={sizeClass}>
  {#if name}
    {#if src}
      <Avatar.Image class="object-cover" {src} alt={name} />
      <Avatar.Fallback class="text-primary">{getInitials(name)}</Avatar.Fallback
      >
    {:else}
      <Avatar.Fallback class="text-primary">{getInitials(name)}</Avatar.Fallback
      >
    {/if}
  {/if}
</Avatar.Root>
