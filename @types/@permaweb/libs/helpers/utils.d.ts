export declare function checkValidAddress(address: string | null): boolean;
export declare function formatAddress(address: string | null, wrap: boolean): string;
export declare function getTagValue(list: {
    [key: string]: any;
}[], name: string): string | null;
export declare function formatCount(count: string): string;
export declare function formatPercentage(percentage: any): string;
export declare function formatDate(dateArg: string | number | null, dateType: 'iso' | 'epoch', fullTime?: boolean): string | null;
export declare function getRelativeDate(timestamp: number): string;
export declare function formatRequiredField(field: string): string;
export declare function splitTagValue(tag: any): any;
export declare function getTagDisplay(value: string): string;
export declare function getDataURLContentType(dataURL: string): string | null;
export declare function getBase64Data(dataURL: string): string;
export declare function getByteSize(input: string | Buffer): number;
export declare function getTotalTokenBalance(tokenBalances: {
    profileBalance: number;
    walletBalance: number;
} | null): number | null;
export declare function isFirefox(): boolean;
export declare function reverseDenomination(number: number): number;
export declare function cleanProcessField(value: string): string;
export declare function cleanTagValue(value: string): string;
/**
 * Extracts all values from a key-value store that match a given prefix
 * @param store The key-value store object to search
 * @param prefix The prefix to filter keys by (e.g., 'portal')
 * @returns Array of values whose keys match the prefix
 */
export declare function getStoreNamespace<T = any>(prefix: string, store: Record<string, T>): T[];
export declare function buildStoreNamespace(prefix: string, value: string): string;
export declare const globalLog: (...args: any[]) => void;
export declare function mapToProcessCase(obj: any): any;
export declare function mapFromProcessCase(obj: any): any;
export declare function getBootTag(key: string, value: string): {
    name: string;
    value: string;
};
