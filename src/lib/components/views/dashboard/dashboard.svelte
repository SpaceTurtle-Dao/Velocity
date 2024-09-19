<script lang="ts">
    import Profile from "$lib/models/Profile";
    let profiles: Profile = [];

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

<div>
    <div class="profiles">
        <h2>Profiles/Relays</h2>
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
</div>

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
