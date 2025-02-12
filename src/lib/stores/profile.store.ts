import type { Profile } from "$lib/models/Profile";
import { writable } from "svelte/store";

export const userRelay = writable<string>();
export const isConnected = writable<boolean>(false);
export const currentUser = writable<Profile>();
export const user = writable<Profile>();
export const followers = writable<Array<string>>([]);
