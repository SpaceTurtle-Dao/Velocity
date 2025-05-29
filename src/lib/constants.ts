export function MU_URL(): string {
    switch (import.meta.env.MODE) {
        case "development": {
            return "https://mu.velocity.cloudnet.marshal.ao";
        }
        case "staging": {
            return "https://mu.velocity.cloudnet.marshal.ao";
        }
        case "production": {
            return "https://mu.velocity.cloudnet.marshal.ao";
        }
    }
    return "https://mu.velocity.cloudnet.marshal.ao";
}

export function CU_URL(): string {
    switch (import.meta.env.MODE) {
        case "development": {
            return "https://cu.velocity.cloudnet.marshal.ao";
        }
        case "staging": {
            return "https://cu.velocity.cloudnet.marshal.ao";
        }
        case "production": {
            return "https://cu.velocity.cloudnet.marshal.ao";
        }
    }
    return "https://cu.velocity.cloudnet.marshal.ao";
}

export function GATEWAY_URL(): string {
    switch (import.meta.env.MODE) {
        case "development": {
            return "https://gateway.velocity.cloudnet.marshal.ao";
        }
        case "staging": {
            return "https://gateway.velocity.cloudnet.marshal.ao";
        }
        case "production": {
            return "https://gateway.velocity.cloudnet.marshal.ao";
        }
    }
    return "https://gateway.velocity.cloudnet.marshal.ao";
}

export function SCHEDULER(): string {
    switch (import.meta.env.MODE) {
        case "development": {
            return "Tm7v2ddwSr_5UxjmuCmhkMSZpzhtKJkkpLMZK_p6mQU";
        }
        case "staging": {
            return "Tm7v2ddwSr_5UxjmuCmhkMSZpzhtKJkkpLMZK_p6mQU";
        }
        case "production": {
            return "Tm7v2ddwSr_5UxjmuCmhkMSZpzhtKJkkpLMZK_p6mQU";
        }
    }
    return "Tm7v2ddwSr_5UxjmuCmhkMSZpzhtKJkkpLMZK_p6mQU";
}

export function AOS_MODULE(): string {
    switch (import.meta.env.MODE) {
        case "development": {
            return "28gHGe_ARwPfCL7zYD2HB5oGvvP74mbfbHLESNFo55o";
        }
        case "staging": {
            return "28gHGe_ARwPfCL7zYD2HB5oGvvP74mbfbHLESNFo55o";
        }
        case "production": {
            return "28gHGe_ARwPfCL7zYD2HB5oGvvP74mbfbHLESNFo55o";
        }
    }
    return "";
}

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

export function HUB_REGISTRY_ID(): string {
    switch (import.meta.env.MODE) {
        case "development": {
            return "g_eSbkmD4LzfZtXaCLmeMcLIBQrqxnY-oFQJJNMIn4w";
        }
        case "staging": {
            return "g_eSbkmD4LzfZtXaCLmeMcLIBQrqxnY-oFQJJNMIn4w";
        }
        case "production": {
            return "g_eSbkmD4LzfZtXaCLmeMcLIBQrqxnY-oFQJJNMIn4w";
        }
    }
    return "g_eSbkmD4LzfZtXaCLmeMcLIBQrqxnY-oFQJJNMIn4w";
}

export function PROFILE_REGISTRY_ID(): string {
    switch (import.meta.env.MODE) {
        case "development": {
            return "9ahkAJRhJO46sALHkqb1_0Ck-hSpqBCLJwdxvtMzoqI";
        }
        case "staging": {
            return "9ahkAJRhJO46sALHkqb1_0Ck-hSpqBCLJwdxvtMzoqI";
        }
        case "production": {
            return "9ahkAJRhJO46sALHkqb1_0Ck-hSpqBCLJwdxvtMzoqI";
        }
    }
    return "9ahkAJRhJO46sALHkqb1_0Ck-hSpqBCLJwdxvtMzoqI";
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

export function ARWEAVE_URL(): string {
    switch (import.meta.env.MODE) {
        case "development": {
            return "arweave.velocity.cloudnet.marshal.ao";
        }
        case "staging": {
            return "arweave.velocity.cloudnet.marshal.ao";
        }
        case "production": {
            return "arweave.net";
        }
    }
    return "";
}

export function toUrl(tx: string) {
    return "https://"+ARWEAVE_URL()+"/"+tx;
}

export const DEFAULT_QUANTITY = "1000000000000000000"
export const DECIMALS = 1000000000000;


export const AR_Token = "xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10"
export const AO_Token = "0syT13r0s0tgPmIed95bJnuSqaD29HQNN8D3ElLSrsc"
export const BazarUCM = "U3TjJAZWJjlWBB4KAXSHKzuky81jtyh0zqH8rUL4Wd0"

export function formatNumber(num: number) {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
    let tier = Math.log10(Math.abs(num)) / 3 | 0;

    if (tier === 0) return num.toString();

    const suffix = suffixes[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;

    return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
}
