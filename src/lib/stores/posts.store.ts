import { createLocalStorageStore } from "./local-storage.store";
import type { Post } from "$lib/models/Post";

export const postsStore = createLocalStorageStore<Post[]>("posts", [], {
  comparator: (a, b) => b.timestamp - a.timestamp,
});
