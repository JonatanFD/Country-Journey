import Konva from "konva";
import { CANVA_ELEMENT } from "./utils/constants";
import "./style.css";
import { loadCountriesOnCanva, loadRoutes, transformRoutes, zoom } from "./utils/utils-main";
import { getCities, getRoutes } from "./services/service";
import { City, RoutesData } from "./types/types";

var stage = new Konva.Stage({
  container: CANVA_ELEMENT, // id of container <div>
  width: window.innerWidth,
  height: window.innerHeight,
  draggable: true,
});

var layer = new Konva.Layer();

const dataCities = await getCities() as City[]
const routesData = await getRoutes() as RoutesData

const routes = transformRoutes(routesData, dataCities)

loadRoutes(layer, routes);
loadCountriesOnCanva(layer, dataCities);

zoom(stage);
stage.add(layer);
stage.draw();

window.addEventListener("resize", () => {
  stage.width(window.innerWidth);
  stage.height(window.innerHeight);
  stage.draw();
});