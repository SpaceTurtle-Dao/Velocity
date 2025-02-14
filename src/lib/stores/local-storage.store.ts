import { writable } from "svelte/store";


export const profilesStore = writable<Map<string,any>>();
