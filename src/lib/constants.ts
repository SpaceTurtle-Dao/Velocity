export function HUB_MESSAGE_ID(): string {
    switch (import.meta.env.MODE) {
        case "development": {
            return "6FhxvMPEDArljbh1C2XlkY68-QgepPy7UTpM3czWrt0";
        }
        case "staging": {
            return "6FhxvMPEDArljbh1C2XlkY68-QgepPy7UTpM3czWrt0";
        }
        case "production": {
            return "6FhxvMPEDArljbh1C2XlkY68-QgepPy7UTpM3czWrt0";
        }
    }
    return "";
}

export function REGISTRY_ID(): string {
    switch (import.meta.env.MODE) {
        case "development": {
            return "dVL1cJFikqBQRbtHQiOxwto774TilKtrymfcaQO8HGQ";
        }
        case "staging": {
            return "dVL1cJFikqBQRbtHQiOxwto774TilKtrymfcaQO8HGQ";
        }
        case "production": {
            return "dVL1cJFikqBQRbtHQiOxwto774TilKtrymfcaQO8HGQ";
        }
    }
    return "";
}

export function RELAY_MESSAGE_ID(): string {
    switch (import.meta.env.MODE) {
        case "development": {
            return "xF1cmzb4QKkPXxxt-k--sHjhs7EUoK7xJ1nQ6xGcul0";
        }
        case "staging": {
            return "xF1cmzb4QKkPXxxt-k--sHjhs7EUoK7xJ1nQ6xGcul0";
        }
        case "production": {
            return "xF1cmzb4QKkPXxxt-k--sHjhs7EUoK7xJ1nQ6xGcul0";
        }
    }
    return "";
}


export function WAR_TOKEN(): string {
    switch (import.meta.env.MODE) {
        case "development": {
            return "WPyLgOqELOyN_BoTNdeEMZp5sz3RxDL19IGcs3A9IPc";
        }
        case "staging": {
            return "WPyLgOqELOyN_BoTNdeEMZp5sz3RxDL19IGcs3A9IPc";
        }
        case "production": {
            return "WPyLgOqELOyN_BoTNdeEMZp5sz3RxDL19IGcs3A9IPc";
        }
    }
    return "";
}

export const ARWEAVE_ADDRESS = "https://7emz5ndufz7rlmskejnhfx3znpjy32uw73jm46tujftmrg5mdmca.arweave.net/"

export const DEFAULT_QUANTITY = "1000000000000000000"
export const DECIMALS = 1000000000000;


export const ARToken = "xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10"

export const BazarUCM = "U3TjJAZWJjlWBB4KAXSHKzuky81jtyh0zqH8rUL4Wd0"

export function formatNumber(num: number) {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'P', 'E']; // Add more if needed
    let tier = Math.log10(Math.abs(num)) / 3 | 0;

    if (tier === 0) return num.toString();

    const suffix = suffixes[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;

    return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
}