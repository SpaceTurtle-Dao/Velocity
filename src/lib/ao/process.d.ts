declare module '*/process.svelte' {
    export function send(token: string, tags: any[], data: any): Promise<any>;
    export function createProcess(): Promise<string>;
} 