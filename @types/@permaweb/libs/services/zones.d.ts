import { DependencyType, TagType } from 'helpers/types';
export declare function createZoneWith(deps: DependencyType): (args: {
    tags?: TagType[];
}, callback?: (status: any) => void) => Promise<string | null>;
export declare function updateZoneWith(deps: DependencyType): (args: object, zoneId: string) => Promise<string | null>;
export declare function addToZoneWith(deps: DependencyType): (args: {
    path: string;
    data: object;
}, zoneId: string) => Promise<string | null>;
export declare function getZoneWith(deps: DependencyType): (zoneId: string) => Promise<any | null>;
