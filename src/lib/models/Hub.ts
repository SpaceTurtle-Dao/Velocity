import type { Spec } from "./Spec"

export type Hub = {
    User: string,
    Followers: string[],
    Following: string[],
    spec:Spec
}