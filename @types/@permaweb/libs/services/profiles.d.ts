import { DependencyType, ProfileArgsType, ProfileType } from 'helpers/types';
export declare function createProfileWith(deps: DependencyType): (args: ProfileArgsType, callback?: (status: any) => void) => Promise<string | null>;
export declare function updateProfileWith(deps: DependencyType): (args: ProfileArgsType, profileId: string, callback?: (status: any) => void) => Promise<string | null>;
export declare function getProfileByIdWith(deps: DependencyType): (profileId: string) => Promise<ProfileType | null>;
export declare function getProfileByWalletAddressWith(deps: DependencyType): (walletAddress: string) => Promise<(ProfileType & any) | null>;
export declare function createProfileWith_ZONE(deps: DependencyType): (args: ProfileArgsType, callback?: (status: any) => void) => Promise<string | null>;
export declare function updateProfileWith_ZONE(deps: DependencyType): (args: ProfileArgsType, profileId: string, callback?: (status: any) => void) => Promise<string | null>;
export declare function getProfileByIdWith_ZONE(deps: DependencyType): (profileId: string) => Promise<ProfileType | null>;
export declare function getProfileByWalletAddressWith_ZONE(deps: DependencyType): (walletAddress: string) => Promise<(ProfileType & any) | null>;
