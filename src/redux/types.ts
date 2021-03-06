import { UserRole } from '../common/types';

export interface ReduxState {
    user: GenericUserType;
    server: ServerInfoType;
}

export interface GenericUserType {
    id: string;
    name: string;
    image: string;
    type: UserRole;
    privacy: boolean;
    onboardingStep?: number;
    balance?: string;
    wallet?: string | null;
    settings?: UserSettings;
}

export interface UserSettings {
    budget: string;
    maxFollowers: number;
    smallArtistsConstant: number;
}

export interface ServerInfoType {
    status: string;
    time: string;
    nanoPrice: number;
    nanoMinimumAmount: string;
    frontend: {
        version: string;
        hotfix: boolean;
    };
    maintenance: {
        start: string | null;
        end: string | null;
    };
}
