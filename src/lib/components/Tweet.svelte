<script>
  import { MessageCircle, Repeat, Heart, Share, DollarSign, TrendingUp } from 'lucide-svelte';
  import { Card, CardContent } from '$lib/components/ui/ui/card';
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/ui/avatar';
  import { Button } from '$lib/components/ui/ui/button';

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

  $: formattedPrice = price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  $: formattedMarketCap = marketCap.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  function handleLike() {
    likes += 1;
  }

  function handleRetweet() {
    retweets += 1;
  }
</script>

<Card class="max-w-full md:max-w-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
  <CardContent class="p-6">
    <div class="flex items-start gap-4">
      <Avatar class="h-12 w-12 ring-2 ring-primary ring-offset-2 transition-all duration-300 hover:scale-110">
        <AvatarImage src={avatarSrc} alt={`Avatar of ${username}`} />
        <AvatarFallback>{username.charAt(0)}</AvatarFallback>
      </Avatar>
      <div class="flex-1 space-y-3">
        <div class="flex items-center gap-2">
          <a href="/" class="font-semibold text-lg hover:underline">{username}</a>
          <span class="text-sm text-muted-foreground">{handle} · {time}</span>
        </div>
        <p class="text-base leading-relaxed">{content}</p>
        {#if showImage}
          <div class="mt-3 rounded-lg overflow-hidden">
            <img
              src={imageSrc}
              alt="Tweet image"
              class="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
              style="aspect-ratio: 600/400;"
            />
          </div>
        {/if}
        <div class="flex items-center gap-4 text-sm text-muted-foreground mt-4">
          <div class="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
            <DollarSign class="h-4 w-4 text-primary" />
            <span class="font-medium">{formattedPrice}</span>
          </div>
          <div class="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
            <TrendingUp class="h-4 w-4 text-primary" />
            <span class="font-medium">{formattedMarketCap}</span>
          </div>
        </div>
        <div class="flex items-center gap-6 mt-4">
          <Button variant="ghost" size="sm" on:click={handleLike} class="flex items-center gap-2 hover:text-primary transition-colors duration-300">
            <Heart class="h-5 w-5" />
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" on:click={handleRetweet} class="flex items-center gap-2 hover:text-primary transition-colors duration-300">
            <Repeat class="h-5 w-5" />
            <span>{retweets}</span>
          </Button>
          <Button variant="ghost" size="sm" class="flex items-center gap-2 hover:text-primary transition-colors duration-300">
            <MessageCircle class="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" class="flex items-center gap-2 hover:text-primary transition-colors duration-300">
            <Share class="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  </CardContent>
</Card>