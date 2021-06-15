import { UserRole } from '../common/types';

export interface ReduxState {
    user: GenericUserType;
}

export interface GenericUserType {
    id: string;
    name: string;
    image: string;
    type: UserRole;
    privacy: boolean;
    onboardingStep?: number;
    balance?: string;
    settings?: {
        budget: string;
        maxFollowers: number;
        smallArtistConstant: number;
    };
}
