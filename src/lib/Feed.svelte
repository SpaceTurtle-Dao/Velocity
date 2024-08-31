<!-- Feed.svelte -->
<script>
       import { onMount } from "svelte";
       import Tweet from "./Post.svelte";

       let tweets = [
              {
                     id: "1",
                     username: "johnDoe",
                     text: "Just learned Svelte! #SvelteLearning",
                     likes: 10,
                     retweets: 5,
              },
              {
                     id: "2",
                     username: "janeSmith",
                     text: "I'm loving this Svelte tutorial! #SvelteTutorials",
                     likes: 20,
                     retweets: 10,
              },
              {
                     id: "3",
                     username: "janeSmith",
                     text: "I'm loving this Svelte tutorial! #SvelteTutorials",
                     likes: 20,
                     retweets: 10,
              },
       ];

       onMount(() => {
              // fetch tweets from API or database here
              // for demonstration purposes, we'll just use the pre-defined array
              console.log("tweets:", tweets);
       });

       // function handleTweetLike(tweetId) {
       //        const tweet = tweets.find((t) => t.id === tweetId);
       //        if (tweet) {
       //               tweet.likes++;
       //        }
       // }

       // function handleTweetRetweet(tweetId) {
       //        const tweet = tweets.find((t) => t.id === tweetId);
       //        if (tweet) {
       //               tweet.retweets++;
       //        }
       // }
</script>

<div>
       {#each tweets as tweet}
              <Tweet
                     id={tweet.id}
                     username={tweet.username}
                     text={tweet.text}
                     likes={tweet.likes}
                     retweets={tweet.retweets}
                     onLike={() => {}}
                     onRetweet={() => {}}
              />
       {/each}
</div>
