import { Stage } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";
import { getCountries, getRoutes } from "../services/info";
import { Country, Route } from "../types/types";
import Konva from "konva";

export function zoom(stage: Stage) {
  var scaleBy = 2;
  stage.on("wheel", (e) => {
    // stop default scrolling
    e.evt.preventDefault();

    var oldScale = stage.scaleX();
    var pointer = stage.getPointerPosition() as Vector2d;

    var mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? 1 : -1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    var newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
  });
}

function drawCircle(country: Country, layer: Konva.Layer) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const scaleFactor = 10;

  const x =
    (country.longitude + 180) * (width / 360) * scaleFactor -
    (width * scaleFactor) / 3; // Conversión longitud a X
    
  const y =    height / 2 - Math.log(Math.tan(Math.PI / 4 + (country.latitude * Math.PI) / 180 / 2)) *      (width / (2 * Math.PI)) *
      scaleFactor -
    height;

  var circle = new Konva.Circle({
    x,
    y,
    radius: 5,
    fill: "white",
  });

  circle.zIndex(30);
  circle.on("mouseover", function () {
    // circle.fill("blue")
  });

  // add the shape to the layer
  layer.add(circle);
}

export async function loadCountriesOnCanva(layer: Konva.Layer) {
  try {
    const countries = (await getCountries()) as Country[];
    countries.forEach((country) => drawCircle(country, layer));
  } catch (error) {
    console.log("Error");
  }
}

function drawLine(route: Route, layer: Konva.Layer) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const scaleFactor = 10;

  const { destiny, origin } = route;

  const x1 =
    (origin.longitude + 180) * (width / 360) * scaleFactor -
    (width * scaleFactor) / 3; // Conversión longitud a X
  const y1 =
    height / 2 -
    Math.log(Math.tan(Math.PI / 4 + (origin.latitude * Math.PI) / 180 / 2)) *
      (width / (2 * Math.PI)) *
      scaleFactor -
    height;

  const x2 =
    (destiny.longitude + 180) * (width / 360) * scaleFactor -
    (width * scaleFactor) / 3; // Conversión longitud a X
  const y2 =
    height / 2 -
    Math.log(Math.tan(Math.PI / 4 + (destiny.latitude * Math.PI) / 180 / 2)) *
      (width / (2 * Math.PI)) *
      scaleFactor -
    height;

  var line = new Konva.Line({
    points: [x1, y1, x2, y2],
    stroke: "blue",
    strokeWidth: 1,
  });
  line.zIndex(10);

  layer.add(line);
}

export async function loadRoutes(layer: Konva.Layer) {
  try {
    const routes = (await getRoutes()) as Route[][];

    for (let i = 0; i < routes.length; i++) {
      const cityRoutes = routes[i];
      for (let j = 0; j < cityRoutes.length; j++) {
        const route = cityRoutes[j];

        console.log(route);

        drawLine(route, layer);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
