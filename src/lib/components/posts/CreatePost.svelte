<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Textarea } from "$lib/components/ui/textarea";
    import { event, fetchEvents } from "$lib/ao/relay";
    import { upload } from "$lib/ao/uploader";
    import { currentUser } from "$lib/stores/profile.store";
    import type { Tag } from "$lib/models/Tag";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Plus, Image, X } from "lucide-svelte";
    import ButtonWithLoader from "$lib/components/ButtonWithLoader/ButtonWithLoader.svelte";
    import ProfilePicture from "$lib/components/UserProfile/ProfilePicture.svelte";

    let content = "";
    let fileInput: HTMLInputElement | null = null;
    let selectedMedia: File | null = null;
    let mediaPreviewUrl: string | null = null;
    let isLoading = false;
    let dialogOpen = false;

    function clearFields() {
        content = "";
        selectedMedia = null;
        mediaPreviewUrl = null;
        if (fileInput) {
            fileInput.value = "";
        }
    }

    function handleMediaButtonClick() {
        if (fileInput) {
            fileInput.click();
        }
    }

    function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            selectedMedia = target.files[0];
            mediaPreviewUrl = URL.createObjectURL(selectedMedia);
        }
    }

    function removeSelectedMedia() {
        selectedMedia = null;
        mediaPreviewUrl = null;
        if (fileInput) {
            fileInput.value = "";
        }
    }

    async function handleSubmit() {
        isLoading = true;
        let kind: Tag = {
            name: "Kind",
            value: "1",
        };
        let markerTag: Tag = {
            name: "marker",
            value: "root",
        };
        let _tags: Array<Tag> = [kind, markerTag];
        let _content = content;
        if (selectedMedia) {
            let media = await upload(selectedMedia);
            let dimisions = ""; //"3024x4032"
            let urlTag: Tag = {
                name: "url",
                value: media.url,
            };
            let mTag: Tag = {
                name: "mimeType",
                value: media.mimeType || "",
            };
            let dimTag: Tag = {
                name: "dim",
                value: dimisions,
            };
            _content = _content + " " + media.url;
            _tags.push(urlTag);
            _tags.push(mTag);
            _tags.push(dimTag);
        }

        let contentTag: Tag = {
            name: "Content",
            value: _content,
        };
        _tags.push(contentTag);
        await event(_tags);
        console.log("///FETCHING EVENTS///");
        //fetchEvents($currentUser.Process, _filters);
        isLoading = false;
        dialogOpen = false;
    }

    $: if (dialogOpen === false) {
        clearFields();
    }
</script>

<Dialog.Root bind:open={dialogOpen}>
    <Dialog.Trigger
        class="w-full h-13 bg-primary text-secondary rounded-full py-3 font-bold text-lg hover:bg-ring transition-colors duration-200 flex items-center justify-center"
    >
        <Plus class="w-5 h-5 mr-2" />
        Post
    </Dialog.Trigger>
    <Dialog.Content class="w-full text-primary border-border">
        <Dialog.Header>
            <Dialog.Title>Create a Post</Dialog.Title>
            <Dialog.Description>Share what's on your mind</Dialog.Description>
        </Dialog.Header>
        <form on:submit|preventDefault={() => {}}>
            <div class="flex">
                <!-- <ProfilePicture
                    src={$currentUser.Profile.picture}
                    name={$currentUser.Profile.name}
                    size="lg"
                /> -->

                <div class="w-full">
                    <Textarea
                        bind:value={content}
                        placeholder="What's happening?!"
                        class="text-lg w-full bg-background border-none focus:border-none outline-none focus:outline-none focus-visible:outline-none ring-none focus:ring-none focus-visible:ring-none ring-background overflow-y-hidden"
                    ></Textarea>
                    {#if mediaPreviewUrl}
                        <div class="relative p-5">
                            {#if selectedMedia && selectedMedia.type.startsWith("video")}
                                <!-- svelte-ignore a11y-media-has-caption -->
                                <video
                                    src={mediaPreviewUrl}
                                    controls
                                    class="w-full h-48 object-cover rounded-md"
                                ></video>
                            {:else}
                                <img
                                    src={mediaPreviewUrl}
                                    alt="Selected media"
                                    class="w-full object-cover rounded-md"
                                />
                            {/if}
                            <Button
                                variant="ghost"
                                on:click={removeSelectedMedia}
                                class="text-muted-primary bg-muted-foreground h-18 w-18 hover:text-foreground rounded-full absolute top-2 right-2 p-1"
                            >
                                <X />
                            </Button>
                        </div>
                    {/if}
                </div>
            </div>
            <input
                type="file"
                accept="image/*, video/*"
                bind:this={fileInput}
                class="hidden"
                on:change={handleFileChange}
            />
        </form>
        <Dialog.Footer>
            <div class="w-full flex flex-row justify-between">
                <Button
                    type="button"
                    variant="ghost"
                    on:click={handleMediaButtonClick}
                    class="text-primary hover:bg-primary/10 rounded-full"
                >
                    <Image size={24} />
                </Button>

                <ButtonWithLoader
                    class="px-8 w-36 rounded-full font-semibold  text-md"
                    loader={isLoading}
                    disabled={isLoading || (!content && !selectedMedia)}
                    on:click={handleSubmit}>Post</ButtonWithLoader
                >
            </div>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
