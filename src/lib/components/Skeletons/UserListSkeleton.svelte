<script lang="ts">
    import { Skeleton } from "$lib/components/ui/skeleton";
</script>

<div class="flex items-center justify-between h-12">
    <div class="flex gap-2">
        <Skeleton class="w-10 h-10 rounded-full" />

        <div class="grid gap-1 overflow-hidden">
            <Skeleton class="w-24 h-3.5 rounded-full" />
            <Skeleton class="w-28 h-3.5 rounded-full" />
        </div>
    </div>
    <Skeleton class="h-8 w-[120px]  rounded-full"></Skeleton>
</div>

<div class="flex items-center justify-between h-12">
    <div class="flex gap-2">
        <Skeleton class="w-10 h-10 rounded-full" />

        <div class="grid gap-1 overflow-hidden">
            <Skeleton class="w-28 h-3.5 rounded-full" />
            <Skeleton class="w-28 h-3.5 rounded-full" />
        </div>
    </div>
    <Skeleton class="h-8 w-[120px]  rounded-full"></Skeleton>
</div>

<div class="flex items-center justify-between h-12">
    <div class="flex gap-2">
        <Skeleton class="w-10 h-10 rounded-full" />

        <div class="grid gap-1 overflow-hidden">
            <Skeleton class="w-28 h-3.5 rounded-full" />
            <Skeleton class="w-24 h-3.5 rounded-full" />
        </div>
    </div>
    <Skeleton class="h-8 w-[120px]  rounded-full"></Skeleton>
</div>
