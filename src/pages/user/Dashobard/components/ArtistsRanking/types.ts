export interface ApiResponse {
    previous: string | null;
    current: string;
    next: string | null;
    data: Item[];
}

export interface Item {
    id: string;
    name: string;
    image: string;
    followers: number;
    duration: number;
    weighedDuration: number | null;
    payout: string;
    estimatedPayout?: string;
}

export type TimeSpan = 'week' | 'month' | 'year';
