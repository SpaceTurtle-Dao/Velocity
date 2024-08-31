<script>
    import CreatePost from "$lib/components/createPost.svelte";
    const posts = [
        {
            Id: "1",
            ProcessId: "process1",
            Creator: "John Doe",
            Created_at: 1625097600000, // Example timestamp
            Kind: 1,
            Tags: ["beach", "summer"],
            Content: "Just had an amazing day at the beach! 🏖️",
            Engagement: { likes: 15, comments: 3, shares: 2 },
            Analytics: { views: 100, clicks: 20 },
        },
        {
            Id: "2",
            ProcessId: "process2",
            Creator: "Jane Smith",
            Created_at: 1625184000000, // Example timestamp
            Kind: 2,
            Tags: ["cooking", "recipe"],
            Content: "Trying out a new recipe tonight. Wish me luck! 👨‍🍳",
            Engagement: { likes: 8, comments: 1, shares: 0 },
            Analytics: { views: 50, clicks: 10 },
        },
        {
            Id: "3",
            ProcessId: "process3",
            Creator: "Sam Johnson",
            Created_at: 1625270400000, // Example timestamp
            Kind: 3,
            Tags: ["books", "reading"],
            Content:
                "Just finished reading an incredible book. Highly recommend! 📚",
            Engagement: { likes: 20, comments: 5, shares: 3 },
            Analytics: { views: 150, clicks: 30 },
        },
    ];

    // @ts-ignore
    function formatDate(timestamp) {
        return new Date(timestamp).toLocaleString();
    }

    // @ts-ignore
    function getKindLabel(kind) {
        switch (kind) {
            case 1:
                return "General";
            case 2:
                return "Update";
            case 3:
                return "Review";
            default:
                return "Unknown";
        }
    }

    function handleCreatePost() {
        console.log("crate");
    }
</script>

<div class="max-w-2xl mx-auto p-4 bg-background">
    <CreatePost on:createPost={handleCreatePost} />
    {#each posts as post (post.Id)}
        <div class="bg-secondary rounded-lg shadow-md p-4 mb-4">
            <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-primary">{post.Creator}</span>
                <span class="text-sm text-primary"
                    >{formatDate(post.Created_at)}</span
                >
            </div>
            <div class="mb-2 py-2 text-primary">{post.Content}</div>
            <div class="mb-2 flex flex-wrap">
                {#each post.Tags as tag}
                    <span class=" text-white text-xs font-semibold px-1 rounded"
                        >#{tag}</span
                    >
                {/each}
            </div>

            <div class="text-sm text-secondary mb-2">
                Views: {post.Analytics.views} | Clicks: {post.Analytics.clicks}
            </div>
            <div class="flex flex-wrap text-sm text-gray-500">
                <button class="hover:text-primary px-3"
                    >Like {post.Engagement.likes}</button
                >
                <button class="hover:text-primary px-3"
                    >Comment {post.Engagement.comments}</button
                >
                <button class="hover:text-primary px-3"
                    >Share {post.Engagement.shares}</button
                >
            </div>
        </div>
    {/each}
</div>
