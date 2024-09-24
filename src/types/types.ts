export interface City {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
}

export interface Route {
    from: City;
    to: City;
    distance: number;
}

export type RoutesData = RouteData[]

export interface RouteData {
    from: string;
    to: string;
    distance: number;
}