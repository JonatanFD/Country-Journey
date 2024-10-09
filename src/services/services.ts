import { CategoryStatus } from "../types";

const API_URL = "http://127.0.0.1:5000/";

export async function getCities() {
    try {
        const data = await fetch(API_URL + "cities");
        const countries = await data.json();

        return countries;
    } catch (error) {
        console.log(error);
    }
}

export async function getRoutes() {
    try {
        const data = await fetch(API_URL + "routes");
        const routes = await data.json();

        return routes;
    } catch (error) {
        console.log(error);
    }
}
