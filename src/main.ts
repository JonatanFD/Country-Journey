import Konva from "konva";
import { CANVA_ELEMENT } from "./utils/constants";
import "./style.css";
import { loadCountriesOnCanva, loadRoutes, transformRoutes, transformToMercator, zoom } from "./utils/utils-main";
import { getCities, getRoutes } from "./services/info";
import { Country, Route } from "./types/types";

var stage = new Konva.Stage({
  container: CANVA_ELEMENT, // id of container <div>
  width: window.innerWidth,
  height: window.innerHeight,
  draggable: true,
});

var layer = new Konva.Layer();

const dataCities = await getCities() as Country[]
const routesData = await getRoutes() as Route[][]

const cities = transformToMercator(dataCities)
const routes = transformRoutes(routesData, cities)

loadRoutes(layer, routes);
loadCountriesOnCanva(layer, cities);

zoom(stage);
stage.add(layer);
stage.draw();

window.addEventListener("resize", () => {
  stage.width(window.innerWidth);
  stage.height(window.innerHeight);
  stage.draw();
});