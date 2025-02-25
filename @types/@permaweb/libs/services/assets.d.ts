import { AssetCreateArgsType, AssetDetailType, AssetHeaderType, DependencyType, GQLNodeResponseType } from 'helpers/types';
export declare function createAtomicAssetWith(deps: DependencyType): (args: AssetCreateArgsType, callback?: (status: any) => void) => Promise<string>;
export declare function getAtomicAsset(deps: DependencyType, id: string, args?: {
    useGateway?: boolean;
}): Promise<AssetDetailType | null>;
export declare function getAtomicAssetWith(deps: DependencyType): (id: string, args?: {
    useGateway?: boolean;
}) => Promise<AssetDetailType | null>;
export declare function getAtomicAssets(ids: string[]): Promise<AssetHeaderType[] | null>;
export declare function buildAsset(element: GQLNodeResponseType): any;
