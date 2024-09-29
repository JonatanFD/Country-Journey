import { INPUT_SELECTOR } from "../utils/constants";

export function createInputSelector(apiFilter: "city" | "country") {
    const container = document.createElement("article");
    container.setAttribute("id", INPUT_SELECTOR);
    const html = `
        <h2>${apiFilter === "city" ? "Ciudades" : "Países"}</h2>
    `;
    container.innerHTML = html;

    return container;
}
