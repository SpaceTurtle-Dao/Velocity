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
