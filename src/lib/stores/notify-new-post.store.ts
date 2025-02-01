import { writable } from "svelte/store";

// To notify Feed page that a new post has been created
export const notifyNewPostStore = writable(0);
