export interface Country {
    city: string;
    latitude: number;
    longitude: number;
    country: string;
}

export interface Route {
    origin: Country;
    destiny: Country;
    distance: number;
}
