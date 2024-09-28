import { API_URL } from "../utils/constants";

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

export async function getFilteredCities(filters: string) {
  try {
    const data = await fetch(API_URL + "filters", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filters: filters.split(","),
      }),
    });

    const cities = await data.json();

    return cities;
  } catch (error) {
    console.log(error);
  }
}
