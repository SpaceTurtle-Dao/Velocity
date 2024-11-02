<script lang="ts">
    import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";
    import { formatTimestamp } from "$lib/utils/timestamp.utils";
    export let event: any;
    export let user: any;
    function formatContent(content: string): string {
        let urlReplaceContent = content.replace(
            /(?:https?|ftp):\/\/[\n\S]+/g,
            "",
        );

        if (urlReplaceContent.length < 400) {
            return urlReplaceContent;
        }

        return urlReplaceContent.slice(0, 400) + "...";
    }
</script>

<div class="flex mt-4">
    <div class="h-full flex flex-col items-center">
        <ProfilePicture
            size="lg"
            src={user?.Profile?.picture}
            name={user?.Profile?.name}
        />
        <div
            id="vertical-line"
            class="h-full bg-secondary w-[2px] flex-1 mt-3"
        ></div>
    </div>
    <div class="flex flex-col">
        <div
            class="h-12 w-full flex items-center min-w-0 overflow-hidden whitespace-nowrap"
        >
            <div class="text-primary text-base font-medium mr-1 ml-2">
                {user?.Profile?.name}
            </div>
            <div class="text-muted-foreground text-base font-light truncate">
                {"@" + user?.Profile?.display_name}
            </div>

            <span class="text-muted-foreground pl-1">
                · {formatTimestamp(event.Timestamp)}</span
            >
        </div>
        <div class="text-primary text-start mt-4">
            {formatContent(event.Content)}
        </div>

        <div class="text-start text-muted-foreground mt-5">
            {"Replying to "}
            <span class="text-sky-500">{"@" + user?.Profile?.display_name}</span
            >
        </div>
    </div>
</div>
