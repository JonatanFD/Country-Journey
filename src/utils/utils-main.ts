import { Stage } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";
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
  var circle = new Konva.Circle({
    x: country.longitude,
    y: country.latitude,
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
export function loadCountriesOnCanva(layer: Konva.Layer, cities: Country[]) {
  cities.forEach((city) => drawCircle(city, layer));
}


function drawLine(route: Route, layer: Konva.Layer) {
  const points = [
    route.origin.longitude,
    route.origin.latitude,
    route.destiny.longitude,
    route.destiny.latitude,
  ];

  var line = new Konva.Line({
    points,
    stroke: "blue",
    strokeWidth: 1,
  });
  line.zIndex(10);

  layer.add(line);
}

export function loadRoutes(layer: Konva.Layer, routes: Route[][]) {
  for (let i = 0; i < routes.length; i++) {
    const cityRoutes = routes[i];
    for (let j = 0; j < cityRoutes.length; j++) {
      const route = cityRoutes[j];

      console.log(route);

      drawLine(route, layer);
    }
  }
}

export function transformToMercator(countries: Country[]) {
  for (let i = 0; i < countries.length; i++) {
    const country = countries[i];
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scaleFactor = 20;

    const x =
      (country.longitude + 180) * (width / 360) * scaleFactor -
      (width * scaleFactor) / 3; // Conversión longitud a X

    const y =
      height / 2 -
      Math.log(Math.tan(Math.PI / 4 + (country.latitude * Math.PI) / 180 / 2)) *
        (width / (2 * Math.PI)) *
        scaleFactor -
      height;

    country.latitude = y;
    country.longitude = x;
  }

  return countries;
}

function hashCity(city: Country): string {
  return city.city + city.country;
}

export function transformRoutes(dataRoutes: Route[][], cities: Country[]) {
  const cityDict = {};

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    console.log(city);
    // @ts-ignore
    cityDict[hashCity(city)] = city;
  }

  for (let i = 0; i < dataRoutes.length; i++) {
    for (let j = 0; j < dataRoutes[i].length; j++) {
      console.log(dataRoutes[i][j]);

      const origin = dataRoutes[i][j].origin
      const destiny = dataRoutes[i][j].destiny;
      
      // @ts-ignore
      dataRoutes[i][j].origin = cityDict[hashCity(origin)];
      // @ts-ignore
      dataRoutes[i][j].destiny = cityDict[hashCity(destiny)];
    }
  }

  return dataRoutes;
}
