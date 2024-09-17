import { API_URL } from "../utils/constants";

export async function getCountries() {
  try {
    const data = await fetch(API_URL + "countries");
    const countries = await data.json();
    return countries;
  } catch (error) {
    console.log(error);
  }
}
