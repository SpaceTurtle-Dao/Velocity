import { fetchEvents, } from "$lib/ao/relay";
import { get, writable, type Readable } from "svelte/store";
import { PostType, type Post } from "$lib/models/Post";


export interface PostService extends Readable<Map<string, Post>> {
    fetchPost: (hubId: string, since: Number, until: Number) => Promise<void>;
    fetchPostWithAuthors: (hub: string, authors: string[]) => Promise<void>;
    fetchReplies: (hubId: string, id: string) => Promise<void>;
    fetchRepost: (hubId: string, id: string) => Promise<void>;
    fetchLikes: (hubId: string, id: string) => Promise<any[]>;
    get: (hubId: string, id: string) => Promise<Post>;
}

const service = (): PostService => {
    const { subscribe, set, update } = writable<Map<string, Post>>(
        new Map<string, any>()
    );
    return {
        subscribe,
        fetchPost: async (hubId: string, since: Number, until: Number): Promise<void> => {
            let posts = get(postService)
            console.log("**POST SIZE**")
            console.log(posts.size)
            if (posts.size > 0) {
                try {
                    const filter = {
                        kinds: ["1", "6"],
                        since: since,
                        until: until
                    };
                    const filter2 = {
                        tags: { marker: ["root", "repost"] },
                    };

                    const _filters = JSON.stringify([filter, filter2]);
                    fetchEvents(hubId, _filters).then((events) => {
                        for (var i = 0; i < events.length; i++) {
                            console.log(events[i])
                            if (events[i].Content) {
                                let post = postFactory(events[i]);
                                posts.set(post.id, post)

                            }
                        }
                        // console.log("posts 2",posts.size)
                        set(posts)
                    });
                } catch (error) {
                    throw (error)
                }
            } else {
                try {
                    const filter = {
                        kinds: ["1", "6"],
                        since: since,
                        until: until
                    };
                    const filter2 = {
                        tags: { marker: ["root", "repost"] },
                    };
                    // console.log("filter",filter);

                    const _filters = JSON.stringify([filter, filter2]);
                    let events = await fetchEvents(hubId, _filters);
                    for (var i = 0; i < events.length; i++) {
                        if (events[i].Content) {
                            let post = postFactory(events[i]);
                            posts.set(post.id, post)

                        }
                    }
                    // console.log("posts 1", posts.size);
                    set(posts)
                } catch (error) {
                    throw (error)
                }
            }
        },
        fetchPostWithAuthors: async (hub: string, authors: string[] = []): Promise<void> => {
            let posts = get(postService)
            let _posts = posts.values().toArray().filter((post) => {
                return authors.includes(post.from)
            })
            if (_posts.length > 0) {
                try {
                    const filter = {
                        kinds: ["1", "6"],
                        authors: authors
                    };
                    const filter2 = {
                        tags: { marker: ["root", "repost"] },
                    };

                    const _filters = JSON.stringify([filter, filter2]);
                    fetchEvents(hub, _filters).then((events) => {
                        for (var i = 0; i < events.length; i++) {
                            if (events[i].Content) {
                                let post = postFactory(events[i]);
                                posts.set(post.id, post)
                            }
                        }
                        set(posts)
                    });
                } catch (error) {
                    throw (error)
                }
            } else {
                try {
                    const filter = {
                        kinds: ["1", "6"],
                        authors: authors
                    };
                    const filter2 = {
                        tags: { marker: ["root", "repost"] },
                    };

                    const _filters = JSON.stringify([filter, filter2]);
                    let events = await fetchEvents(hub, _filters);
                    for (var i = 0; i < events.length; i++) {
                        if (events[i].Content) {
                            let post = postFactory(events[i]);
                            posts.set(post.id, post)

                        }
                    }
                    set(posts)
                } catch (error) {
                    throw (error)
                }
            }
        },
        fetchReplies: async (hub: string, id: string): Promise<void> => {
            //console.log("getting Replies")
            let posts = get(postService);
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
                let events = await fetchEvents(hub, _filters);
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
        fetchRepost: async (hub: string, id: string): Promise<void> => {
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
                let events = await fetchEvents(hub, _filters)
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
        fetchLikes: async (hub: string, id: string): Promise<any[]> => {
            let likes: any[] = []
            try {
                const filter = {
                    kinds: ["7"]
                };
                const filter2 = {
                    tags: { e: [id] },
                };

                const _filters = JSON.stringify([filter, filter2]);
                likes = await fetchEvents(hub, _filters)
                return likes
            } catch (error) {
                throw (error)
            }
        },
        get: async (hub: string, id: string): Promise<Post> => {
            let posts = get(postService)
            if (posts.has(id)) {
                try {
                    const filter = {
                        kinds: ["1", "6"],
                        ids: [id]
                    };
                    const _filters = JSON.stringify([filter]);
                    fetchEvents(hub, _filters).then(async (events) => {
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
                    let events = await fetchEvents(hub, _filters);
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
    let repost: Post | undefined;
    switch (event.Tags["marker"]) {
        case "media":
            postType = PostType.Media
            break
        case "reply":
            postType = PostType.Reply
            break
        case "repost":
            postType = PostType.Repost
            let _event = JSON.parse(event.Content);
            postType = PostType.Repost;
            repost = postFactory(_event);
            break
        default:
            postType = PostType.Root
    }

    if (event.Kind == "6") {
        let _event = JSON.parse(event.Content);
        postType = PostType.Repost;
        repost = postFactory(_event);
    };
    let _post: Post = {
        id: event.Id,
        from: event.From,
        owner: event.Owner,
        timestamp: event.Timestamp,
        content: event.Content,
        type: postType,
        rePost: repost,
        reposted: [],
        mimeType: event.mimeType,
        url: event.url,
        e: event.e,
        event: event,
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

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const postService = service();
