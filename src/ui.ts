import { getCitiesData } from "./konva";
import { getJourney } from "./services/services";
import { CategoryStatus } from "./types";
import { $, $id } from "./utils";

// Variables
const FORM = $("form") as HTMLFormElement;

const FROM = $id("from") as HTMLInputElement;
const TO = $id("to") as HTMLInputElement;
const FILTERS = $id("filters") as HTMLInputElement;

const inputs = [FROM, TO, FILTERS];
const cities = getCitiesData();

const JOURNEY_FORM_STATE: CategoryStatus = {
    open: false,
    inputType: "city",
    searchValue: "",
    from: "",
    to: "",
    countries: [],
};

// Functions
const displayCategoryMenu = (open: boolean) => {
    const CATEGORY = $id("category") as HTMLElement;
    if (open) {
        CATEGORY.classList.remove("hidden");
        return;
    }
    CATEGORY.classList.add("hidden");
};
const updateCategoryMenu = (config: CategoryStatus) => {
    const CATEGORY_TITLE = $id("category-title") as HTMLElement;
    CATEGORY_TITLE.innerHTML =
        config.inputType === "city" ? "Ciudades" : "Países";
};

const updateCountriesFilters = () => {
    FILTERS.value = "";

    let filtersValue: string = "";
    JOURNEY_FORM_STATE.countries.forEach((country) => {
        filtersValue += `${country}, `;
    });

    FILTERS.value = filtersValue.trim().slice(0, -1);
};
const updateCategoryMenuOptions = (selectedInput: HTMLInputElement) => {
    const CATEGORY_LIST = $id("category-list") as HTMLElement;
    CATEGORY_LIST.innerHTML = "";

    let options: string[] = [];

    // se obtienen las opciones
    if (JOURNEY_FORM_STATE.inputType === "country") {
        console.log(JOURNEY_FORM_STATE.searchValue);

        options = [
            ...new Set(
                cities
                    .filter((city) =>
                        city.country
                            .toLowerCase()
                            .includes(JOURNEY_FORM_STATE.searchValue.toLowerCase())
                    )
                    .map((opt) => opt.country)
            ),
        ];
    } else if (JOURNEY_FORM_STATE.inputType === "city") {
        const cities = getCitiesData().filter((city) =>
            city.city
                .toLowerCase()
                .includes(JOURNEY_FORM_STATE.searchValue.toLowerCase())
        );
        options = cities.map((city) => city.city + "," + city.country);
    }

    // se renderizan las opciones
    for (const option of options) {
        const button = document.createElement("button");
        const inputId = selectedInput.id;
        button.innerHTML = option;
        button.setAttribute("class", "hover:bg-[#242424]");

        const showSelectedOption = () => {
            if (inputId === "from" || inputId === "to") {
                if (option === JOURNEY_FORM_STATE[inputId]) {
                    button.classList.add("bg-zinc-600");
                    button.classList.add("hover:bg-zinc-600");
                }
            } else {
                // Para los filtros
                if (
                    JOURNEY_FORM_STATE.countries.find(
                        (country) => country === option
                    )
                ) {
                    button.classList.add("bg-zinc-600");
                    button.classList.add("hover:bg-zinc-600");
                }
            }
        };

        const removePrevSelectedOption = (countryValue?: string) => {
            const matches = [
                ...CATEGORY_LIST.getElementsByClassName("bg-zinc-600"),
            ];

            if (inputId === "from" || inputId === "to") {
                matches.forEach((match) => {
                    match.classList.remove("bg-zinc-600");
                    match.classList.remove("hover:bg-zinc-600");
                });
            } else {
                matches.forEach((match) => {
                    if (match.innerHTML === countryValue) {
                        match.classList.remove("bg-zinc-600");
                        match.classList.remove("hover:bg-zinc-600");
                    }
                });
                updateCountriesFilters();
            }
        };

        button.addEventListener("click", () => {
            removePrevSelectedOption();
            selectedInput.value = option;
            // para los puntos de origen y destino
            if (inputId === "from" || inputId === "to") {
                JOURNEY_FORM_STATE[selectedInput.id.toString() as "from" | "to"] =
                    option;

            } else {
                // Para los filtros
                if (
                    JOURNEY_FORM_STATE.countries.find(
                        (country) => country === option
                    )
                ) {
                    JOURNEY_FORM_STATE.countries.splice(
                        JOURNEY_FORM_STATE.countries.indexOf(option),
                        1
                    );

                    removePrevSelectedOption(option);
                } else {
                    JOURNEY_FORM_STATE.countries.push(option);
                    updateCountriesFilters();
                }
            }

            showSelectedOption();
        });

        CATEGORY_LIST.appendChild(button);
        showSelectedOption();
    }
};

// Eventos
inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        const value = target.value;

        JOURNEY_FORM_STATE.searchValue = value;

        displayCategoryMenu(true);

        JOURNEY_FORM_STATE.inputType = target.id === "filters" ? "country" : "city";

        updateCategoryMenuOptions(input);
    });
    input.addEventListener("focus", (e) => {
        const target = e.target as HTMLInputElement;

        JOURNEY_FORM_STATE.inputType = target.id === "filters" ? "country" : "city";
        updateCategoryMenu(JOURNEY_FORM_STATE);
        updateCategoryMenuOptions(input);
        displayCategoryMenu(true);
    });
});

FORM.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log(cities);
    
    const journeyConstrains = {
        from: JOURNEY_FORM_STATE.from,
        to: JOURNEY_FORM_STATE.to,
        countries: JOURNEY_FORM_STATE.countries,
    }

    try {
        const journey = await getJourney(journeyConstrains);
        console.log( "get journey", journey);
    } catch (error) {
        console.log(error);
    }


});