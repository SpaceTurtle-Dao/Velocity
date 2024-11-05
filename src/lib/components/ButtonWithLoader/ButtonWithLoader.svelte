<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Loader } from "lucide-svelte";
    import { fly } from "svelte/transition";
    import { twMerge } from "tailwind-merge";

    export let disabled: boolean = false;
    export let loader = false;
</script>

<Button
    class={twMerge(
        "disabled:cursor-not-allowed disabled:opacity-100 disabled:text-muted-foreground disabled:bg-secondary",
        $$props.class,
    )}
    {disabled}
    on:click
>
    {#if loader}
        <div
            in:fly={{ delay: 300, duration: 300, x: -50, opacity: 0 }}
            out:fly={{ duration: 200, x: -50, opacity: 0 }}
        >
            <Loader
                class={twMerge("h-7 w-7 animate-spin", $$props.loaderClass)}
            />
        </div>
    {:else}
        <div
            in:fly={{ delay: 200, duration: 300, x: 50, opacity: 0 }}
            out:fly={{ duration: 200, x: 50, opacity: 0 }}
        >
            <slot />
        </div>
    {/if}
</Button>
