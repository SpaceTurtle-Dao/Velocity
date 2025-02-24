import { BatchAGQLResponseType, BatchGQLArgsType, DefaultGQLResponseType, GQLArgsType, GQLNodeResponseType } from 'helpers/types';
export declare function getGQLData(args: GQLArgsType): Promise<DefaultGQLResponseType>;
export declare function getAggregatedGQLData(args: GQLArgsType, callback?: (message: string) => void): Promise<GQLNodeResponseType[] | null>;
export declare function getBatchGQLData(args: BatchGQLArgsType): Promise<BatchAGQLResponseType>;
