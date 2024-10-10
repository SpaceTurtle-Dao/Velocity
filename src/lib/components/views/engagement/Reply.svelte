<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { MessageCircle } from "lucide-svelte";
    import { onMount } from "svelte";
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Image, Smile, Calendar } from "lucide-svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import Nip92 from "$lib/handlers/NIP92.svelte";
    import { Separator } from "$lib/components/ui/separator/index";
    import type { UserInfo } from "$lib/models/Profile";
    import { currentUser } from "$lib/stores/profile.store";

    export let event: any;
    export let user: UserInfo;

    let count = 0;
    let replyText = "";

    function reply() {
        let kind: Tag = {
            name: "Kind",
            value: "1",
        };

        let e: Tag = {
            name: "e",
            value: event.Id,
        };

        let p: Tag = {
            name: "p",
            value: event.From,
        };

        let marker: Tag = {
            name: "marker",
            value: "reply",
        };
        let _tags: Array<Tag> = [
            kind,
            e,
            p,
            marker,
        ];
        let _content = content;
    }
</script>

<Dialog.Root>
    <Dialog.Trigger>
        <Button
            variant="ghost"
            size="icon"
            class="flex flex-row text-primary space-x-1 bg-transparent hover:bg-transparent"
        >
            <MessageCircle strokeWidth={0.8} class="text-primary" />
            <p class="font-thin">{count}</p>
        </Button>
    </Dialog.Trigger>
    <Dialog.Content
        class="sm:max-w-[500px] max-h-[80vh] overflow-y-auto rounded-lg border-border"
    >
        <Dialog.Header>
            <Dialog.Title class="text-white">Reply</Dialog.Title>
        </Dialog.Header>
        <div class="p-4">
            <div class="flex space-x-3 text-white">
                <Avatar.Root class="h-10 w-10 flex-shrink-0">
                    <Avatar.Image
                        src={user.Profile.picture}
                        alt={user.Profile.display_name}
                    />
                    <Avatar.Fallback
                        >{user.Profile.display_name}</Avatar.Fallback
                    >
                </Avatar.Root>
                <div class="flex-grow overflow-hidden">
                    <p class="font-semibold">{user.Profile.display_name}</p>
                    <div>
                        <Nip92 {event} />
                    </div>
                </div>
            </div>
            <div class="mt-4 flex space-x-3">
                <Avatar.Root class="h-10 w-10 flex-shrink-0">
                    <Avatar.Image
                        src={$currentUser.Profile.picture}
                        alt={$currentUser.Profile.display_name}
                    />
                    <Avatar.Fallback
                        >{$currentUser.Profile.display_name}</Avatar.Fallback
                    >
                </Avatar.Root>
                <div class="flex-grow">
                    <Input
                        type="text"
                        placeholder="Post your reply"
                        bind:value={replyText}
                        class="w-full text-primary"
                    />
                </div>
            </div>

            <div class="mt-4 flex justify-between items-center">
                <div class="flex space-x-2">
                    <Button variant="ghost" size="icon">
                        <Image class="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Smile class="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Calendar class="h-4 w-4 text-primary" />
                    </Button>
                </div>
                <Button on:click={reply} disabled={!replyText.trim()}>
                    Reply
                </Button>
            </div>
        </div>
    </Dialog.Content>
</Dialog.Root>
