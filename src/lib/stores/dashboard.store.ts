import type { Post } from '$lib/models/Meme';
import type { Profile } from '$lib/models/Profile';
import { writable } from 'svelte/store';
import { relay, relays, info, getOwner } from '$lib/ao/relay';



const createProfilesStore = () => {
       const { subscribe, set, update } = writable<Profile[]>([]);

       return {
              subscribe,
              addProfile(profile: Profile) {
                     update(profiles => [...profiles, profile]);
              },

              fetchProfiles() {
                     // update(profiles => [...profiles, profile]);
              }
              // removeProfile(id: number) {
              //        update(profiles => profiles.filter(profile => profile !== id));
              // }
       };
};

const createPostsStore = () => {
       const { subscribe, set, update } = writable<Post[]>([]);

       return {
              subscribe,
              addPost(post: Post) {
                     update(posts => [...posts, post]);
              },
              // filterPostsByProfileId(profileId: number) {
              //        update(posts => posts.filter(post => post. === profileId));
              // }
       };
};

export const profilesStore = createProfilesStore();
export const postsStore = createPostsStore();
