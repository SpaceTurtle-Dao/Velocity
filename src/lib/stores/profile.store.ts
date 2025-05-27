import type { Profile } from "$lib/models/Profile";
import { writable } from "svelte/store";

export const isConnected = writable<boolean>(false);
