<script>
  import CreatePost from './CreatePost.svelte';

  let posts = [
    // ... (keep the existing posts array)
  ];

  function handleCreatePost(event) {
    const { content, mediaFile } = event.detail;
    const newPost = {
      Id: String(posts.length + 1),
      ProcessId: `process${posts.length + 1}`,
      Creator: "Current User", // You might want to replace this with the actual user
      Created_at: Date.now(),
      Kind: 1,
      Tags: [], // You might want to add logic to extract tags from content
      Content: content,
      Engagement: { likes: 0, comments: 0, shares: 0 },
      Analytics: { views: 0, clicks: 0 },
    };

    if (mediaFile) {
      newPost.MediaUrl = URL.createObjectURL(mediaFile);
    }

    posts = [newPost, ...posts];
  }

  // ... (keep the existing helper functions)
</script>

<div class="max-w-2xl mx-auto p-4 bg-gray-100">
  <CreatePost on:createPost={handleCreatePost} />

  {#each posts as post (post.Id)}
    <div class="bg-white rounded-lg shadow-md p-4 mb-4">
      <!-- ... (keep the existing post rendering logic) -->

      <!-- Add this block to display media if present -->
      {#if post.MediaUrl}
        <img src={post.MediaUrl} alt="Post media" class="w-full rounded-lg mb-2">
      {/if}

      <!-- ... (keep the rest of the post rendering logic) -->
    </div>
  {/each}
</div>
```

Finally, update your `App.svelte` file:

```svelte
<script>
  import SocialFeed from './SocialFeed.svelte';
</script>

<main class="container mx-auto px-4">
  <h1 class="text-3xl font-bold text-center my-4">Social Media Feed</h1>
  <SocialFeed />
</main>
