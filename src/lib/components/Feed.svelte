<script>
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

    function formatDate(timestamp) {
        return new Date(timestamp).toLocaleString();
    }

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
</script>

<div class="max-w-2xl mx-auto p-4 bg-gray-100">
    {#each posts as post (post.Id)}
        <div class="bg-white rounded-lg shadow-md p-4 mb-4">
            <div class="flex justify-between items-center mb-2">
                <span class="font-bold">{post.Creator}</span>
                <span class="text-sm text-gray-500"
                    >{formatDate(post.Created_at)}</span
                >
            </div>
            <div class="mb-2">{post.Content}</div>
            <div class="mb-2 text-sm text-gray-600">
                Process ID: {post.ProcessId} | Kind: {getKindLabel(post.Kind)}
            </div>
            <div class="mb-2 flex flex-wrap">
                {#each post.Tags as tag}
                    <span
                        class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded"
                        >{tag}</span
                    >
                {/each}
            </div>
            <div class="flex justify-between text-sm text-gray-500 mb-2">
                <span>Likes: {post.Engagement.likes}</span>
                <span>Comments: {post.Engagement.comments}</span>
                <span>Shares: {post.Engagement.shares}</span>
            </div>
            <div class="text-sm text-gray-500 mb-2">
                Views: {post.Analytics.views} | Clicks: {post.Analytics.clicks}
            </div>
            <div class="flex justify-between text-sm text-gray-500">
                <button class="hover:text-blue-500">Like</button>
                <button class="hover:text-blue-500">Comment</button>
                <button class="hover:text-blue-500">Share</button>
            </div>
        </div>
    {/each}
</div>
