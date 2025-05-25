<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Share, Copy, Check, Twitter, Facebook, MessageCircle } from "lucide-svelte";
    import { onMount } from "svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Input } from "$lib/components/ui/input";
    
    export let post: any;
    
    let shareDialogOpen = false;
    let copied = false;
    let shareUrl = "";
    
    onMount(() => {
        shareUrl = `${window.location.origin}/post/${post.from}/${post.id}`;
    });
    
    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(shareUrl);
            copied = true;
            
            setTimeout(() => {
                copied = false;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            copied = true;
            setTimeout(() => {
                copied = false;
            }, 2000);
        }
    }
    
    function shareToTwitter() {
        const text = encodeURIComponent("Check out this post!");
        const url = encodeURIComponent(shareUrl);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
    
    function shareToFacebook() {
        const url = encodeURIComponent(shareUrl);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    }
    
    function shareViaWebShare() {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this post',
                text: 'Interesting post I found',
                url: shareUrl,
            }).catch(console.error);
        }
    }
    
    function share(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        shareDialogOpen = true;
    }
</script>

<Dialog.Root bind:open={shareDialogOpen}>
    <Dialog.Trigger asChild let:builder>
        <Button
            {...builder}
            variant="ghost"
            size="icon"
            class="flex flex-row text-primary space-x-1 bg-transparent hover:bg-transparent"
            on:click={share}
        >
            <Share strokeWidth={0.8} class="text-primary" />
        </Button>
    </Dialog.Trigger>
    
    <Dialog.Content class="sm:max-w-md bg-background border border-border">
        <Dialog.Header class="pb-4">
            <Dialog.Title class="flex items-center space-x-2 text-foreground text-lg font-semibold">
                <Share size={20} class="text-primary" />
                <span>Share this post</span>
            </Dialog.Title>
            <Dialog.Description class="text-muted-foreground">
                Share this post with others or copy the link to your clipboard.
            </Dialog.Description>
        </Dialog.Header>
        
        <div class="space-y-6 py-4">
            <!-- Copy Link Section -->
            <div class="space-y-3">
                <label class="text-sm font-medium text-foreground">Copy link</label>
                <div class="flex space-x-2">
                    <Input
                        value={shareUrl}
                        readonly
                        class="flex-1 bg-muted/30 border-border text-foreground text-sm"
                        placeholder="Post URL"
                    />
                    <Button
                        on:click={copyToClipboard}
                        variant="outline"
                        size="sm"
                        class="px-3 min-w-[44px] border-border hover:bg-muted"
                        disabled={copied}
                    >
                        {#if copied}
                            <Check size={16} class="text-green-500" />
                        {:else}
                            <Copy size={16} class="text-foreground" />
                        {/if}
                    </Button>
                </div>
                {#if copied}
                    <p class="text-xs text-green-500 flex items-center space-x-1 mt-2">
                        <Check size={12} />
                        <span>Link copied to clipboard!</span>
                    </p>
                {/if}
            </div>
            
            <!-- Social Media Sharing -->
            <div class="space-y-3">
                <label class="text-sm font-medium text-foreground">Share on social media</label>
                <div class="grid grid-cols-2 gap-3">
                    <Button
                        on:click={shareToTwitter}
                        variant="outline"
                        size="sm"
                        class="flex items-center justify-center space-x-2 h-10 border-border hover:bg-muted text-foreground"
                    >
                        <Twitter size={16} />
                        <span>Twitter</span>
                    </Button>
                    
                    <Button
                        on:click={shareToFacebook}
                        variant="outline"
                        size="sm"
                        class="flex items-center justify-center space-x-2 h-10 border-border hover:bg-muted text-foreground"
                    >
                        <Facebook size={16} />
                        <span>Facebook</span>
                    </Button>
                </div>
            </div>
            
            {#if typeof navigator !== 'undefined' && navigator}
                <div class="pt-2">
                    <Button
                        on:click={shareViaWebShare}
                        variant="outline"
                        class="w-full flex items-center justify-center space-x-2 h-10 border-border hover:bg-muted text-foreground"
                    >
                        <MessageCircle size={16} />
                        <span>More sharing options</span>
                    </Button>
                </div>
            {/if}
        </div>
        
        <Dialog.Footer class="pt-4 border-t border-border">
            <Button
                variant="ghost"
                on:click={() => shareDialogOpen = false}
                class="w-full hover:bg-muted text-foreground"
            >
                Close
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>