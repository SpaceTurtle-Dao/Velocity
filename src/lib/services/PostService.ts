// users-profile.store.ts
import { fetchEvents, fetchFollowList, fetchProfile } from "$lib/ao/relay";
import type { Profile } from "$lib/models/Profile";
import { get, writable, type Readable } from "svelte/store";
import { profileService } from "./ProfileService";
import { PostType, type Post } from "$lib/models/Post";

export interface PostService extends Readable<Map<string, Post>> {
    fetchPost: (since: Number, limit: Number) => Promise<Post[]>;
    fetchPostWithAuthors: (authors: string[]) => Promise<Post[]>;
    fetchReplies: (id: string) => Promise<Post[]>;
    fetchRepost: (id: string) => void;
    get: (id: string) => Promise<Post>;
}

const service = (): PostService => {
    const { subscribe, set, update } = writable<Map<string, Post>>(
        new Map<string, any>()
    );
    return {
        subscribe,
        fetchPost: async (since: Number, limit: Number): Promise<Post[]> => {
            let posts = get(postService)
            if (posts.size > 0) {
                try {
                    const filter = {
                        kinds: ["1"],
                        since: since,
                        limit: limit
                    };
                    const filter2 = {
                        tags: { marker: ["root"] },
                    };

                    const _filters = JSON.stringify([filter, filter2]);
                    fetchEvents(_filters).then((events) => {
                        for (var i = 0; i < events.length; i++) {
                            if (events[i].Content) {
                                let post = postFactory(events[i]);
                                posts.set(post.id, post)

                            }
                        }
                        set(posts)
                    });
                    return posts.values().toArray()
                } catch (error) {
                    throw (error)
                }
            } else {
                try {
                    const filter = {
                        kinds: ["1"],
                        since: since,
                        limit: limit
                    };
                    const filter2 = {
                        tags: { marker: ["root"] },
                    };

                    const _filters = JSON.stringify([filter, filter2]);
                    let events = await fetchEvents(_filters);
                    for (var i = 0; i < events.length; i++) {
                        if (events[i].Content) {
                            let post = postFactory(events[i]);
                            posts.set(post.id, post)

                        }
                    }
                    set(posts)
                    return posts.values().toArray()
                } catch (error) {
                    throw (error)
                }
            }
        },
        fetchPostWithAuthors: async (authors: string[] = []): Promise<Post[]> => {
            let posts = get(postService)
            let _posts = posts.values().toArray().filter((post) => {
                return authors.includes(post.from)
            })
            if (_posts.length > 0) {
                try {
                    const filter = {
                        kinds: ["1"],
                        authors:authors
                    };
                    const filter2 = {
                        tags: { marker: ["root"] },
                    };

                    const _filters = JSON.stringify([filter, filter2]);
                    fetchEvents(_filters).then((events) => {
                        for (var i = 0; i < events.length; i++) {
                            if (events[i].Content) {
                                let post = postFactory(events[i]);
                                posts.set(post.id, post)
                            }
                        }
                        set(posts)
                    });
                    return _posts
                } catch (error) {
                    throw (error)
                }
            } else {
                try {
                    const filter = {
                        kinds: ["1"],
                        authors:authors
                    };
                    const filter2 = {
                        tags: { marker: ["root"] },
                    };

                    const _filters = JSON.stringify([filter, filter2]);
                    let events = await fetchEvents(_filters);
                    for (var i = 0; i < events.length; i++) {
                        if (events[i].Content) {
                            let post = postFactory(events[i]);
                            posts.set(post.id, post)

                        }
                    }
                    set(posts)
                    let _posts = posts.values().toArray().filter((post) => {
                        return authors.includes(post.from)
                    })
                    return _posts
                } catch (error) {
                    throw (error)
                }
            }
        },
        fetchReplies: async (id: string): Promise<Post[]> => {
            //console.log("getting Replies")
            let posts = get(postService);
            let replies: Post[] = []
            try {
                const filter = {
                    kinds: ["1"],
                    //since: since,
                    //limit: limit
                };
                const filter2 = {
                    tags: { e: [id] },
                };

                const _filters = JSON.stringify([filter, filter2]);
                let events = await fetchEvents(_filters);
                for (var i = 0; i < events.length; i++) {
                    if (events[i].Content) {
                        let post = postFactory(events[i]);
                        posts.set(post.from, post)
                        replies.push(post)
                    }
                }
                set(posts)
            } catch (error) {
                throw (error)
            }
            return replies
        },
        fetchRepost: async (id: string) => {
            let posts = get(postService);
            try {
                const filter = {
                    kinds: ["6"],
                    //since: since,
                    //limit: limit
                };
                const filter2 = {
                    tags: { e: [id] },
                };

                const _filters = JSON.stringify([filter, filter2]);
                let events = await fetchEvents(_filters)
                for (var i = 0; i < events.length; i++) {
                    if (events[i].Content) {
                        let post = postFactory(events[i]);
                        posts.set(post.from, post)
                    }
                }
                set(posts)
            } catch (error) {
                throw (error)
            }
        },
        get: async (id: string): Promise<Post> => {
            let posts = get(postService)
            if (posts.has(id)) {
                try {
                    const filter = {
                        kinds: ["1", "6"],
                        ids: [id]
                    };
                    const _filters = JSON.stringify([filter]);
                    fetchEvents(_filters).then(async (events) => {
                        if (events.length == 0) return;
                        let post = postFactory(events[0]);
                        post = await getRepost(post)
                        if (post.content) {
                            posts.set(id, post)
                            set(posts)
                        } else {
                            throw ("Content is Empty")
                        }
                    })
                } catch (error) {
                    throw (error)
                }
                return posts.get(id)!
            } else {
                try {
                    const filter = {
                        kinds: ["1", "6"],
                        ids: [id]
                    };
                    const _filters = JSON.stringify([filter]);
                    let events = await fetchEvents(_filters);
                    if (events.length == 0) throw ("Not Found")
                    let post = postFactory(events[0]);
                    post = await getRepost(post)
                    if (post.content) {
                        posts.set(id, post)
                        set(posts)
                        return post
                    } else {
                        throw ("Content is Empty")
                    }
                } catch (error) {
                    throw (error)
                }
            }

        },
    };
};

function postFactory(event: any): Post {
    let postType: PostType;
    switch (event.Tags["marker"]) {
        case "media":
            postType = PostType.Media
            break
        case "reply":
            postType = PostType.Reply
            break
        case "repost":
            postType = PostType.Repost
            break
        default:
            postType = PostType.Root
    }

    if (event.Kind == "6") postType = PostType.Repost;
    let _post: Post = {
        id: event.Id,
        from: event.From,
        timestamp: event.Timestamp,
        content: event.Content,
        type: postType,
        rePost: undefined,
        reposted: [],
        mimeType: event.mimeType,
        url: event.url,
        e: event.e,
        p: event.p
    }
    return _post
}

async function getRepost(post: Post): Promise<Post> {
    let _post = post;
    if (_post.type == PostType.Repost) {
        const content = JSON.parse(_post.content);
        _post.rePost = postFactory(content);
    }
    return _post
}

export const postService = service();
