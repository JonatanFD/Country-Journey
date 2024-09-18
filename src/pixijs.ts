import { getCountries } from "./services/info";
import "./style.css";

import { Application, Graphics, Container } from "pixi.js";
import { Country } from "./types/types";

const app = new Application();
await app.init({ background: "#242424", resizeTo: window,  });
document.body.appendChild(app.canvas);

const countries = (await getCountries()) as Country[];

const G = new Graphics();


const c = G.circle(100, 100, 50);
c.fill(0xff0000);
app.stage.addChild(c);



for (let i = 0; i < countries.length; i++) {
  const country = countries[i];
  let circle = G.circle(country.latitude, country.longitude, 3).fill("red");
    app.stage.addChild(circle);

}


