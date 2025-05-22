import type { Post } from "./Post"
import type { Profile } from "./Profile"
import type { Spec } from "./Spec"

export type Hub = {
    User: string,
    Followers: string[],
    Following: string[],
    Spec:Spec,
    FeePolicy:any,
    scaleFactor:number,
    spikeEnabled:Boolean,
    spikeWindow:number,
    spikeScale:number
}