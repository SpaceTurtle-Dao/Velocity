import { DependencyType, TagType } from 'helpers/types';
export declare function resolveTransactionWith(deps: DependencyType): (data: any) => Promise<any>;
export declare function resolveTransaction(deps: DependencyType, data: any): Promise<any>;
export declare function createTransaction(deps: DependencyType, args: {
    data: any;
    tags?: TagType[];
    uploadMethod?: 'default' | 'turbo';
}): Promise<string>;
