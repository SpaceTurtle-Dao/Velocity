export type UserInfo = {
    Process: string;
    Token: string;
    Events: number;
    Profile: Profile;
    SubscriptionCost: number;
    FeedCost: number;
    Subs: number;
    Subscriptions: number;
    CreatedAt: number;
};

export type Profile = {
    name: string;
    about?: string;
    picture?: string;
    display_name: string;
    website?: string;
    banner?: string;
    bot?: boolean;
};

export const profileFromEvent = (event: any): Profile => {
    if (event.Kind == "0") return JSON.parse(event.Content);
    throw 400;
};
