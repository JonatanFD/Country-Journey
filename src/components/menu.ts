import { Browser } from "./browser";

export class Menu {
  private FORM = document.getElementById("form") as HTMLFormElement;

  private StartPoint = document.getElementById("from") as HTMLInputElement;
  private EndPoint = document.getElementById("to") as HTMLInputElement;


  
  private Filters = document.getElementById("filters") as HTMLSelectElement;

  private OnSubmit = (e: Event) => {
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
  };

  private OnClick = (e: Event, api : string, container: HTMLElement) => {
    e.preventDefault();
    const browser = new Browser(api, container, [])
    browser.build()
  }

  private OnChange() {

  }

  constructor() {
    this.FORM.addEventListener("submit", this.OnSubmit);
    this.StartPoint.addEventListener("click", (e: Event) => this.OnClick(e, "filters", this.StartPoint));
    this.EndPoint.addEventListener("click", (e: Event) => this.OnClick(e, "filters", this.EndPoint));

    this.Filters.addEventListener("change", this.OnChange);
  }
}
