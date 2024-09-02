<script>
  import { MessageCircleIcon, RepeatIcon, HeartIcon, ShareIcon, DollarSignIcon, TrendingUpIcon } from 'lucide-svelte';
  import Card from '$lib/components/ui/ui/card/card.svelte';
  import Avatar from '$lib/components/ui/ui/avatar/avatar.svelte';
  import Button from '$lib/components/ui/ui/button/button.svelte';

  export let avatarSrc = '/placeholder-user.jpg';
  export let username = 'User';
  export let handle = '@user';
  export let time = '1h';
  export let content = 'Tweet content here';
  export let imageSrc = '';
  export let showImage = false;
  export let likes = 0;
  export let retweets = 0;
  export let price = 0;
  export let marketCap = 0;
  export let onLike = () => {};
  export let onRetweet = () => {};

  $: formattedPrice = price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  $: formattedMarketCap = marketCap.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
</script>

<Card class="max-w-full md:max-w-lg">
  <div class="p-4">
    <div class="flex items-start gap-4">
      <a href="/" class="flex-shrink-0">
        <Avatar class="h-10 w-10 rounded-full">
          <img src={avatarSrc} alt={`Avatar of ${username}`} />
          <span>{username.charAt(0)}</span>
        </Avatar>
      </a>
      <div class="flex-1 space-y-2">
        <div class="flex items-center gap-2">
          <a href="/" class="font-medium">{username}</a>
          <span class="text-sm text-muted-foreground">{handle} · {time}</span>
        </div>
        <p class="text-sm">
          {content}
        </p>
        {#if showImage}
          <!-- svelte-ignore a11y-img-redundant-alt -->
          <img
            src={imageSrc}
            alt="Tweet image"
            class="rounded-md object-cover w-full"
            style="aspect-ratio: 600/400; object-fit: cover;"
          />
        {/if}
        <div class="flex items-center gap-4 text-sm text-muted-foreground">
          <div class="flex items-center gap-1">
            <DollarSignIcon class="h-4 w-4" />
            <span>Price: {formattedPrice}</span>
          </div>
          <div class="flex items-center gap-1">
            <TrendingUpIcon class="h-4 w-4" />
            <span>Market Cap: {formattedMarketCap}</span>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="icon" on:click={onLike}>
            <HeartIcon class="h-5 w-5" />
            <span class="sr-only">Like</span>
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="icon" on:click={onRetweet}>
            <RepeatIcon class="h-5 w-5" />
            <span class="sr-only">Retweet</span>
            <span>{retweets}</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircleIcon class="h-5 w-5" />
            <span class="sr-only"> Comment</span>
          </Button>
          <Button variant="ghost" size="icon">
            <ShareIcon class="h-5 w-5" />
            <span class="sr-only">Share</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</Card>