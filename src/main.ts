import Konva from "konva";
import { CANVA_ELEMENT } from "./utils/constants";
import "./style.css";
import { loadCountriesOnCanva, loadRoutes, zoom } from "./utils/utils-main";

var stage = new Konva.Stage({
  container: CANVA_ELEMENT, // id of container <div>
  width: window.innerWidth,
  height: window.innerHeight,
  draggable: true,
});

var layer = new Konva.Layer();



await loadRoutes(layer);
await loadCountriesOnCanva(layer);
zoom(stage);

stage.add(layer);
stage.draw();
