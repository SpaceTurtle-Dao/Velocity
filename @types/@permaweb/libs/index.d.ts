import * as Helpers from './helpers';
import * as Common from './common';
import * as Services from './services';
declare function init(deps: Helpers.DependencyType): {
    createZone: (args: {
        tags?: Helpers.TagType[];
    }, callback?: (status: any) => void) => Promise<string | null>;
    updateZone: (args: object, zoneId: string) => Promise<string | null>;
    addToZone: (args: {
        path: string;
        data: object;
    }, zoneId: string) => Promise<string | null>;
    getZone: (zoneId: string) => Promise<any | null>;
    createProfile: (args: Helpers.ProfileArgsType, callback?: (status: any) => void) => Promise<string | null>;
    updateProfile: (args: Helpers.ProfileArgsType, profileId: string, callback?: (status: any) => void) => Promise<string | null>;
    getProfileById: (profileId: string) => Promise<Helpers.ProfileType | null>;
    getProfileByWalletAddress: (walletAddress: string) => Promise<(Helpers.ProfileType & any) | null>;
    createAtomicAsset: (args: Helpers.AssetCreateArgsType, callback?: (status: any) => void) => Promise<string>;
    getAtomicAsset: (id: string, args?: {
        useGateway?: boolean;
    }) => Promise<Helpers.AssetDetailType | null>;
    getAtomicAssets: typeof Services.getAtomicAssets;
    createComment: (args: Helpers.CommentCreateArgType, callback?: (status: any) => void) => Promise<string>;
    getComment: (id: string) => Promise<Helpers.CommentDetailType | null>;
    getComments: (args: {
        parentId?: string;
        rootId?: string;
    }) => Promise<{
        id: any;
        content: string;
        parentId: any;
        rootId: any;
    }[]>;
    createCollection: (args: {
        title: string;
        description: string;
        creator: string;
        thumbnail: any;
        banner: any;
        skipRegistry?: boolean;
        skipActivity?: boolean;
    }, callback?: (status: any) => void) => Promise<string>;
    updateCollectionAssets: (args: {
        collectionId: string;
        assetIds: string[];
        creator: string;
        updateType: "Add" | "Remove";
    }) => Promise<string>;
    getCollection: (collectionId: string) => Promise<Helpers.CollectionDetailType | null>;
    getCollections: (args: {
        creator?: string;
    }) => Promise<Helpers.CollectionType[] | null>;
    resolveTransaction: (data: any) => Promise<any>;
    getGQLData: typeof Common.getGQLData;
    getAggregatedGQLData: typeof Common.getAggregatedGQLData;
    createProcess: (args: Helpers.ProcessCreateType, statusCB?: (status: any) => void) => Promise<string>;
    readProcess: (args: Helpers.MessageSendType) => Promise<any>;
    sendMessage: (args: Helpers.MessageSendType) => Promise<string>;
    mapFromProcessCase: typeof Helpers.mapFromProcessCase;
    mapToProcessCase: typeof Helpers.mapToProcessCase;
};
declare const _default: {
    init: typeof init;
};
export default _default;
export * from './helpers/types';
