export function INDEXER_ID(): string {
    switch (import.meta.env.MODE) {
        case "development": {
            return "VU_wocPzsgUfGmWqMwLkJ8cCSsQTJe3K2ZIiz85KO7A";
        }
        case "staging": {
            return "VU_wocPzsgUfGmWqMwLkJ8cCSsQTJe3K2ZIiz85KO7A";
        }
        case "production": {
            return "VU_wocPzsgUfGmWqMwLkJ8cCSsQTJe3K2ZIiz85KO7A";
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

export const DEFAULT_QUANTITY = "1000000000000000000"
export const DECIMALS = 1000000000000;


export function formatNumber(num:number) {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'P', 'E']; // Add more if needed
    let tier = Math.log10(Math.abs(num)) / 3 | 0;

    if (tier === 0) return num.toString();

    const suffix = suffixes[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;

    return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
}