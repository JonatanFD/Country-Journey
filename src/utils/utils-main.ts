import { Stage } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";
import { City, Route, RoutesData } from "../types/types";
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

const current = document.getElementById("current") as HTMLSpanElement;

function drawCircle(City: City, layer: Konva.Layer) {
  var circle = new Konva.Circle({
    x: City.longitude,
    y: City.latitude,
    radius: 5,
    fill: "white",
  });

  circle.zIndex(30);
  circle.on("mouseover", function () {
    // circle.fill("blue")
    current.innerHTML = `${City.city}, ${City.country}`;
  });

  // add the shape to the layer
  layer.add(circle);
}
export function loadCountriesOnCanva(layer: Konva.Layer, cities: City[]) {
  cities.forEach((city) => drawCircle(city, layer));
}

function drawLine(route: Route, layer: Konva.Layer) {
  const points = [
    route.from.longitude,
    route.from.latitude,
    route.to.longitude,
    route.to.latitude,
  ];

  var line = new Konva.Line({
    points,
    stroke: "green",
    strokeWidth: 1,
  });
  line.zIndex(10);

  layer.add(line);
}

export function loadRoutes(layer: Konva.Layer, routes: Route[]) {
  for (let i = 0; i < routes.length; i++) {
    const cityRoutes = routes[i];
    drawLine(cityRoutes, layer);
  }
}


function hashCity(city: City): string {
  return `${city.city},${city.country}`;
}


export function transformRoutes(dataRoutes: RoutesData, cities: City[]) {
  const filteredRoutes : Route[] = [];
  const cityDict = {};

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    // @ts-ignore
    cityDict[hashCity(city)] = city;
  }

  for (let i = 0; i < dataRoutes.length; i++) {
    const route = dataRoutes[i];
    const formated : Route = {
      // @ts-ignore
      from: cityDict[route.from],
      // @ts-ignore
      to: cityDict[route.to],
      distance: route.distance
    }
    filteredRoutes.push(formated);
  }

  return filteredRoutes;
}
