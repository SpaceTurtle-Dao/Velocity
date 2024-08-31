<script>
       export let id;
       export let username;
       export let text;
       export let likes;
       export let retweets;
       export let onLike;
       export let onRetweet;

       function handleLike() {
              // onLike(id);
       }

       function handleRetweet() {
              // onRetweet(id);
       }
</script>

<article>
       <header>
              <h2>{username}</h2>
              <p>{text}</p>
       </header>
       <footer>
              <span class="likes">{likes} likes</span> |
              <span class="retweets">{retweets} retweets</span> |
              <button on:click={handleLike}>Like</button> |
              <button on:click={handleRetweet}>Retweet</button>
       </footer>
</article>
