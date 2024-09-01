<script lang="ts">
       //@ts-nocheck
       import { onMount } from 'svelte';
       import Tweet from './Tweet.svelte';
       import { fetchMemes, fetchMemesByIds } from './ao/mememaker';
     
       let tweets = [];
     
       onMount(async () => {
         try {
           const fetchedMemes = await fetchMemes("1", "100");
           tweets = fetchedMemes.map(meme => ({
             id: meme.Pool,
             avatarSrc: meme.Profile?.Image ? `https://arweave.net/${meme.Profile.Image}` : '/default-avatar.png',
             username: meme.Profile?.Name || 'Anonymous',
             handle: `@${meme.Creator.slice(0, 12)}`,
             time: formatTime(meme.createdAt),
             content: meme.Post.Content,
             likes: meme.Pumps,
             retweets: meme.Replies,
             price: meme.Analytics.Price,
             marketCap: meme.Analytics.MarketCap
           }));
         } catch (error) {
           console.error('Error fetching memes:', error);
         }
       });
     
       function formatTime(timestamp) {
         const now = Date.now();
         const diff = now - timestamp;
         const minutes = Math.floor(diff / 60000);
         const hours = Math.floor(minutes / 60);
         const days = Math.floor(hours / 24);
     
         if (days > 0) return `${days}d`;
         if (hours > 0) return `${hours}h`;
         if (minutes > 0) return `${minutes}m`;
         return 'Just now';
       }
     
       function handleTweetLike(tweetId) {
         const tweet = tweets.find((t) => t.id === tweetId);
         if (tweet) {
           tweet.likes++;
         }
       }
     
       function handleTweetRetweet(tweetId) {
         const tweet = tweets.find((t) => t.id === tweetId);
         if (tweet) {
           tweet.retweets++;
         }
       }
     </script>
     
     <div class="flex flex-col items-center max-w-2xl mx-auto px-4 py-8 space-y-6">
       {#each tweets as tweet (tweet.id)}
         <div class="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
           <Tweet
             avatarSrc={tweet.avatarSrc}
             username={tweet.username}
             handle={tweet.handle}
             time={tweet.time}
             content={tweet.content}
             likes={tweet.likes}
             retweets={tweet.retweets}
             onLike={() => handleTweetLike(tweet.id)}
             onRetweet={() => handleTweetRetweet(tweet.id)}
             price={tweet.price}
             marketCap={tweet.marketCap}
           />
         </div>
       {/each}
     </div>