import { writable } from "svelte/store";
export const events = writable<Map<string,string>>();