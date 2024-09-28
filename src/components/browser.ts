import { API_URL } from "../utils/constants";


export class Browser {
    private HTML : string

    private API_PATH : string
    private container : HTMLElement
    private filters : string[]

    private FORM = document.createElement("form") as HTMLFormElement;

    constructor(API_PATH: string, container: HTMLElement, filters: string[]) {
        this.API_PATH = API_PATH
        this.container = container
        this.filters = filters
        this.HTML = ""
    }

    public OnClick(e: Event) {
        e.preventDefault();
        const data = new FormData(this.FORM);

        const from = data.get("from") as string;
        const to = data.get("to") as string;
        const filters = data.get("filters") as string;

        console.log({
        from,
        to,
        filters,
        });
    }


    public async fetchOptions() {
        const response = await fetch(API_URL + this.API_PATH,
            {
                "headers": {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    filters: this.filters
                }),
            }
        )

        const data = await response.json()


        this.HTML = data
        
        return data
    }

    public async build() {
        await this.fetchOptions()

        this.FORM.innerHTML = this.HTML

        this.FORM.addEventListener("submit", this.OnClick);

        this.container.appendChild(this.FORM)
    }




}