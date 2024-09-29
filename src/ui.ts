import { createInputSelector } from "./components/InputSelector";
import { INPUT_SELECTOR } from "./utils/constants";
import { $, $$, $id } from "./utils/utils";

const FORM = $("form") as HTMLFormElement;
const INPUTS = $$("input") as NodeListOf<HTMLInputElement>;
const MENU = $id("menu") as HTMLElement;

FORM?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formdata = new FormData(FORM);

    console.log(JSON.stringify(Object.fromEntries(formdata.entries())));
});

// Se agregan los enventos a los inputs para desplegarel menu de busqueda
for (const input of INPUTS) {
    // Se agrega el evento click para desplegar el menu de busqueda
    input.addEventListener("click", (e) => {
        const target = e.target as HTMLInputElement;

        if (MENU.contains($id(INPUT_SELECTOR))) {
            return;
        }

        const selector = createInputSelector(
            target.id === "filters" ? "country" : "city"
        );

        MENU.appendChild(selector);
    });

    // Se agrega el evento blur para cerrar el menu de busqueda
    input.addEventListener("blur", (e) => {
        const target = e.target as HTMLInputElement;
        const selector = $id(INPUT_SELECTOR) as HTMLElement;

        if (selector) {
            if (!selector.contains(target)) {
                selector.remove();
            }
        }
    });
}
