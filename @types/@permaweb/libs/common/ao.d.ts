import { DependencyType, MessageDryRunType, MessageResultType, MessageSendType, ProcessCreateType, ProcessSpawnType, TagType } from 'helpers/types';
export declare function aoSpawn(deps: DependencyType, args: ProcessSpawnType): Promise<string>;
export declare function aoSendWith(deps: DependencyType): (args: MessageSendType) => Promise<string>;
export declare function aoSend(deps: DependencyType, args: MessageSendType): Promise<string>;
export declare function aoDryRunWith(deps: DependencyType): (args: MessageSendType) => Promise<any>;
export declare function aoDryRun(deps: DependencyType, args: MessageDryRunType): Promise<any>;
export declare function aoMessageResult(deps: DependencyType, args: MessageResultType): Promise<any>;
export declare function aoMessageResults(deps: DependencyType, args: {
    processId: string;
    action: string;
    tags: TagType[] | null;
    data: any;
    responses?: string[];
    handler?: string;
}): Promise<any>;
export declare function handleProcessEval(deps: DependencyType, args: {
    processId: string;
    evalTxId: string | null;
    evalSrc: string | null;
    evalTags?: TagType[];
}): Promise<string | null>;
export declare function aoCreateProcessWith(deps: DependencyType): (args: ProcessCreateType, statusCB?: (status: any) => void) => Promise<string>;
export declare function aoCreateProcess(deps: DependencyType, args: ProcessCreateType, statusCB?: (status: any) => void): Promise<string>;
export declare function waitForProcess(processId: string, _setStatus?: (status: any) => void): Promise<string>;
export declare function fetchProcessSrc(txId: string): Promise<string>;
