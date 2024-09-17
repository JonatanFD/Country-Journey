import { getCountries } from "./services/info";
import { Country } from "./types/types";

const $ = (selector: string) => document.getElementById(selector);
const menu = $("menu") as HTMLDivElement


async function loadCountriesOnMenu() {
    const countries = await getCountries()
    countries.forEach((country : Country) => {
        const div = document.createElement("div")
        div.innerHTML = country.country
        menu.appendChild(div)
    })
}


loadCountriesOnMenu()



