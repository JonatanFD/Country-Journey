import { getCountries } from "./services/service";
import { Country } from "./types/types";

const $ = (selector: string) => document.getElementById(selector);
const menu = $("menu") as HTMLUListElement


async function loadCountriesOnMenu() {
    const countries = await getCountries()
    countries.forEach((country : Country) => {
        const div = document.createElement("div")
        div.innerHTML = country.country
        menu.appendChild(div)
    })
}

loadCountriesOnMenu()



