export interface City {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
}

export interface Route {
    from: string;
    to: string;
    distance: number;
}

export interface CategoryStatus {
    open: boolean;
    inputType: "city" | "country";
    searchValue: string;
    countries: string[];
    from: string,
    to: string
}

export interface JourneyConstrains {
    from: string;
    to: string;
    countries: string[];
}