<script lang="ts">
  import { writable } from "svelte/store";
  import type { Event } from "$lib/models/Event";
  import type { Profile, UserInfo } from "$lib/models/Profile";
  import { currentUser, userRelay } from "../../../stores/profile.store";

  let profile: Profile;
  let userInfo: UserInfo;

  currentUser.subscribe((value) => {
    userInfo = value;
    if (userInfo.Profile && userInfo.Profile.kind === 0) {
      profile = JSON.parse(userInfo.Profile.content);
    } else {
      profile = {
        name: "",
        about: "",
        picture: "",
        display_name: "",
        website: "",
        banner: "",
        bot: false,
      };
    }
  });

  async function updateProfile() {
    const event: Omit<Event, "id"> = {
      pubkey: userInfo.Token,
      created_at: Math.floor(Date.now() / 1000),
      kind: 0,
      tags: [],
      content: JSON.stringify(profile),
    };

    const serialized = JSON.stringify([
      0,
      event.pubkey,
      event.created_at,
      event.kind,
      event.tags,
      event.content,
    ]);

    const eventId = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(serialized),
    );
    const idHex = Array.from(new Uint8Array(eventId))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const fullEvent: Event = {
      ...event,
      id: idHex,
    };

    console.log("Profile update event:", fullEvent);

    userInfo.Profile = fullEvent;
    currentUser.set(userInfo);

    // if ($userRelay) {
    //   const relayConnection = await connectToRelay($userRelay);
    //   await relayConnection.publish(fullEvent);
    // }
  }
</script>

<div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
  <h2 class="text-2xl font-bold mb-6 text-gray-800">Update Your Profile</h2>
  <form on:submit|preventDefault={updateProfile} class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700"
        >Name</label
      >
      <input
        type="text"
        id="name"
        bind:value={profile.name}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    </div>
    <div>
      <label for="display_name" class="block text-sm font-medium text-gray-700"
        >Display Name</label
      >
      <input
        type="text"
        id="display_name"
        bind:value={profile.display_name}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    </div>
    <div>
      <label for="about" class="block text-sm font-medium text-gray-700"
        >About</label
      >
      <textarea
        id="about"
        bind:value={profile.about}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        rows="3"
      ></textarea>
    </div>
    <div>
      <label for="picture" class="block text-sm font-medium text-gray-700"
        >Picture URL</label
      >
      <input
        type="url"
        id="picture"
        bind:value={profile.picture}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    </div>
    <div>
      <label for="website" class="block text-sm font-medium text-gray-700"
        >Website</label
      >
      <input
        type="url"
        id="website"
        bind:value={profile.website}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    </div>
    <div>
      <label for="banner" class="block text-sm font-medium text-gray-700"
        >Banner URL</label
      >
      <input
        type="url"
        id="banner"
        bind:value={profile.banner}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    </div>
    <div class="flex items-center">
      <input
        type="checkbox"
        id="bot"
        bind:checked={profile.bot}
        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
      />
      <label for="bot" class="ml-2 block text-sm text-gray-900">Bot</label>
    </div>
    <button
      type="submit"
      class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Update Profile
    </button>
  </form>
</div>
