export interface ServerInfo {
    status: string;
    time: string;
    nanoPrice: number;
    nanoMinimumAmount: string;
    frontend: {
        version: string
        hotfix: string
    };
    maintenance: {
        start: string
        end: string
    };
}
