import { fetchEvents, } from "$lib/ao/relay";
import { get, writable, type Readable } from "svelte/store";
import { PostType, type Post } from "$lib/models/Post";


export interface RepliesService extends Readable<Map<string, Post>> {
    fetchReplies: (hubId: string, id: string) => Promise<void>;
    delete: () => void;
}

const service = (): RepliesService => {
    const { subscribe, set, update } = writable<Map<string, Post>>(
        new Map<string, any>()
    );
    return {
        subscribe,
        fetchReplies: async (hubId: string, id: string): Promise<void> => {
            let replies = get(repliesService)
            const filter = {
                kinds: ["1"],
                //since: since,
                //limit: limit
            };
            const filter2 = {
                tags: { e: [id] },
            };

            const _filters = JSON.stringify([filter, filter2]);
            if (replies.size > 0) {
                try {

                    fetchEvents(hubId, _filters).then((events) => {
                        for (var i = 0; i < events.length; i++) {
                            //console.log(events[i])
                            if (events[i].Content) {
                                let post = postFactory(events[i]);
                                if (!replies.has(post.original_Id)) replies.set(post.original_Id, post);
                            }
                        }
                        // console.log("posts 2",posts.size)
                        set(replies)
                    });
                } catch (error) {
                    throw (error)
                }
            } else {
                try {
                    let events = await fetchEvents(hubId, _filters);
                    //console.log(events)
                    for (var i = 0; i < events.length; i++) {
                        if (events[i].Content) {
                            let post = postFactory(events[i]);
                            if (!replies.has(post.original_Id)) replies.set(post.original_Id, post);

                        }
                    }
                    // console.log("posts 1", posts.size);
                    set(replies)
                } catch (error) {
                    throw (error)
                }
            }
        },
        delete: () => {
            set(new Map<string, any>())
        }
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
        original_Id: event.Tags["Original-Id"],
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

export const repliesService = service();
