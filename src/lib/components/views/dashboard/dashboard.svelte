<script lang="ts">
    interface Profile {
        id: number;
        name: string;
        avatar: string;
    }

    interface Post {
        id: number;
        profileId: number;
        content: string;
        likes: number;
    }

    const profiles: Profile[] = [
        { id: 1, name: "John Doe", avatar: "https://example.com/john.jpg" },
        { id: 2, name: "Jane Smith", avatar: "https://example.com/jane.jpg" },
        { id: 3, name: "Bob Johnson", avatar: "https://example.com/bob.jpg" },
    ];

    const posts: Post[] = [
        {
            id: 1,
            profileId: 1,
            content: "This is John's first post!",
            likes: 10,
        },
        { id: 2, profileId: 2, content: "Hello from Jane!", likes: 15 },
        { id: 3, profileId: 1, content: "Another post from John", likes: 5 },
        {
            id: 4,
            profileId: 3,
            content: "Bob's thoughts for the day",
            likes: 8,
        },
    ];

    let selectedProfileId: number | null = null;

    function selectProfile(profileId: number): void {
        selectedProfileId = profileId;
    }

    $: filteredPosts =
        selectedProfileId !== null
            ? posts.filter((post) => post.profileId === selectedProfileId)
            : [];

    $: selectedProfile =
        selectedProfileId !== null
            ? profiles.find((p) => p.id === selectedProfileId)
            : null;
</script>

<main>
    <h1>Social Media Dashboard</h1>

    <div class="profiles">
        <h2>Profiles</h2>
        <div class="profile-list">
            {#each profiles as profile (profile.id)}
                <div
                    class="profile"
                    class:selected={selectedProfileId === profile.id}
                    on:click={() => selectProfile(profile.id)}
                >
                    <img src={profile.avatar} alt={profile.name} />
                    <span>{profile.name}</span>
                </div>
            {/each}
        </div>
    </div>

    {#if selectedProfile}
        <div class="posts">
            <h2>Posts for {selectedProfile.name}</h2>
            {#if filteredPosts.length > 0}
                {#each filteredPosts as post (post.id)}
                    <div class="post">
                        <p>{post.content}</p>
                        <span>Likes: {post.likes}</span>
                    </div>
                {/each}
            {:else}
                <p>No posts found for this profile.</p>
            {/if}
        </div>
    {:else}
        <p>Select a profile to view posts.</p>
    {/if}
</main>

<style>
    main {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    .profiles {
        margin-bottom: 20px;
    }

    .profile-list {
        display: flex;
        gap: 10px;
    }

    .profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .profile.selected {
        background-color: #e0e0e0;
    }

    .profile img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
    }

    .post {
        background-color: #f0f0f0;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
    }
</style>
