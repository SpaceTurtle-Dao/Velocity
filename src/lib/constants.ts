export function PROCESS_ID(): string {
    switch (import.meta.env.MODE) {
        case "development": {
            return "H79To8Xv9amLeAstLfwOORpMPIk2Td2EsmP_ePcGNbs";
        }
        case "staging": {
            return "H79To8Xv9amLeAstLfwOORpMPIk2Td2EsmP_ePcGNbs";
        }
        case "production": {
            return "H79To8Xv9amLeAstLfwOORpMPIk2Td2EsmP_ePcGNbs";
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