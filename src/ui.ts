import { getCitiesData } from "./konva";
import { CategoryStatus } from "./types";
import { $, $id } from "./utils";

// Variables
const FORM = $("form") as HTMLFormElement;

const FROM = $id("from") as HTMLInputElement;
const TO = $id("to") as HTMLInputElement;
const FILTERS = $id("filters") as HTMLInputElement;
const COUNTRIES_FILTERS = $id("countries-filters") as HTMLDivElement;

const inputs = [FROM, TO, FILTERS];
const countries = getCitiesData();

const CATEGORY_STATE: CategoryStatus = {
    open: false,
    inputType: "city",
    searchValue: "",
    from: "",
    to: "",
    countries: [],
};

// Functions
const toggleCategoryMenu = (open: boolean) => {
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
    CATEGORY_STATE.countries.forEach((country) => {
        filtersValue += `${country}, `;
    });

    FILTERS.value = filtersValue.trim().slice(0, -1);
};
const updateCategoryMenuOptions = (selectedInput: HTMLInputElement) => {
    const CATEGORY_LIST = $id("category-list") as HTMLElement;
    CATEGORY_LIST.innerHTML = "";

    let options: string[] = [];

    // se obtienen las opciones
    if (CATEGORY_STATE.inputType === "country") {
        console.log(CATEGORY_STATE.searchValue);

        options = [
            ...new Set(
                countries
                    .filter((country) =>
                        country.country
                            .toLowerCase()
                            .includes(CATEGORY_STATE.searchValue.toLowerCase())
                    )
                    .map((opt) => opt.country)
            ),
        ];
    } else if (CATEGORY_STATE.inputType === "city") {
        const cities = getCitiesData().filter((city) =>
            city.city
                .toLowerCase()
                .includes(CATEGORY_STATE.searchValue.toLowerCase())
        );
        options = cities.map((city) => city.city);
    }

    // se renderizan las opciones
    for (const option of options) {
        const button = document.createElement("button");
        const inputId = selectedInput.id;
        button.innerHTML = option;
        button.setAttribute("class", "hover:bg-[#242424]");

        const showSelectedOption = () => {
            if (inputId === "from" || inputId === "to") {
                if (option === CATEGORY_STATE[inputId]) {
                    button.classList.add("bg-zinc-600");
                    button.classList.add("hover:bg-zinc-600");
                }
            } else {
                // Para los filtros
                if (
                    CATEGORY_STATE.countries.find(
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
            if (inputId === "from" || inputId === "to") {
                CATEGORY_STATE[selectedInput.id.toString() as "from" | "to"] =
                    option;
            } else {
                // Para los filtros
                if (
                    CATEGORY_STATE.countries.find(
                        (country) => country === option
                    )
                ) {
                    CATEGORY_STATE.countries.splice(
                        CATEGORY_STATE.countries.indexOf(option),
                        1
                    );

                    removePrevSelectedOption(option);
                } else {
                    CATEGORY_STATE.countries.push(option);
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

        CATEGORY_STATE.searchValue = value;

        toggleCategoryMenu(true);

        CATEGORY_STATE.inputType = target.id === "filters" ? "country" : "city";

        updateCategoryMenuOptions(input);
    });
    input.addEventListener("focus", (e) => {
        const target = e.target as HTMLInputElement;

        CATEGORY_STATE.inputType = target.id === "filters" ? "country" : "city";
        updateCategoryMenu(CATEGORY_STATE);
        updateCategoryMenuOptions(input);
        toggleCategoryMenu(true);
    });
});
