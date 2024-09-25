import type { UserInfo } from "$lib/models/Profile";
import { writable } from "svelte/store";



export const users = writable<Array<UserInfo>>([]);