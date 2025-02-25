import { CollectionDetailType, CollectionType, DependencyType } from 'helpers/types';
export declare function createCollectionWith(deps: DependencyType): (args: {
    title: string;
    description: string;
    creator: string;
    thumbnail: any;
    banner: any;
    skipRegistry?: boolean;
    skipActivity?: boolean;
}, callback?: (status: any) => void) => Promise<string>;
export declare function updateCollectionAssetsWith(deps: DependencyType): (args: {
    collectionId: string;
    assetIds: string[];
    creator: string;
    updateType: "Add" | "Remove";
}) => Promise<string>;
export declare function getCollectionWith(deps: DependencyType): (collectionId: string) => Promise<CollectionDetailType | null>;
export declare function getCollectionsWith(deps: DependencyType): (args: {
    creator?: string;
}) => Promise<CollectionType[] | null>;
