import { evalProcess, fetchEvents } from "$lib/ao/relay";
import { get, writable, type Readable } from "svelte/store";
import { PostType, type Post } from "$lib/models/Post";
import { luaModule } from "./hub_lua";
import { createProcess } from "$lib/ao/process.svelte";
export interface HubService extends Readable<Map<string, Post>> {
    fetchPost: (hub:string, since: Number, until: Number) => Promise<Post[]>;
    fetchPostWithAuthors: (hub:string, authors: string[]) => Promise<Post[]>;
    fetchReplies: (hub:string, id: string) => Promise<Post[]>;
    fetchRepost: (hub:string, id: string) => Promise<Post[]>;
    fetchLikes: (hub:string, id: string) => Promise<any[]>;
    get: (hub:string, id: string) => Promise<Post>;
    create: () => Promise<string>;
}

const service = (): HubService => {
    const { subscribe, set, update } = writable<Map<string, Post>>(
        new Map<string, any>()
    );
    return {
        subscribe,
        fetchPost: async (hubId:string, since: Number, until: Number): Promise<Post[]> => {
            // console.log("since",since);
            // console.log("limit",until);
            let posts = get(hubService)
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

                    const _filters = JSON.stringify([filter,filter2]);
                    fetchEvents(hubId, _filters).then((events) => {
                        for (var i = 0; i < events.length; i++) {
                            if (events[i].Content) {
                                let post = postFactory(events[i]);
                                posts.set(post.id, post)

                            }
                        }
                        // console.log("posts 2",posts.size)
                        set(posts)
                    });
                    return posts.values().toArray()
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
                    return posts.values().toArray()
                } catch (error) {
                    throw (error)
                }
            }
        },
        fetchPostWithAuthors: async (hub:string, authors: string[] = []): Promise<Post[]> => {
            let posts = get(hubService)
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
                    return _posts
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
                    let _posts = posts.values().toArray().filter((post) => {
                        return authors.includes(post.from)
                    })
                    return _posts
                } catch (error) {
                    throw (error)
                }
            }
        },
        fetchReplies: async (hub:string, id: string): Promise<Post[]> => {
            //console.log("getting Replies")
            let posts = get(hubService);
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
                let events = await fetchEvents(hub, _filters);
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
        fetchRepost: async (hub:string, id: string): Promise<Post[]> => {
            let posts = get(hubService);
            let rePosts: Post[] = []
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
                        rePosts.push(post)
                    }
                }
                set(posts)
            } catch (error) {
                throw (error)
            }
            return rePosts
        },
        fetchLikes: async (hub:string, id: string): Promise<any[]> => {
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
            } catch (error) {
                throw (error)
            }
            return likes
        },
        get: async (hub:string, id: string): Promise<Post> => {
            let posts = get(hubService)
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
        create: async (): Promise<string> => {
            const processId = await createProcess();
            evaluateHub(processId)
            return processId
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

async function evaluateHub(processId:string) {
    try{
      await sleep(3000);
      await evalProcess(luaModule, processId);
    }catch(e){
      await evaluateHub(processId);
    }
    
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

export const hubService = service();
