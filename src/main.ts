import Konva from 'konva';
import { CANVA_ELEMENT } from './utils/constants';
import './style.css'
import { getCountries } from './services/info';
import { Country } from './types/types';
import { zoom } from './utils/utils-main';

var stage = new Konva.Stage({
  container: CANVA_ELEMENT,   // id of container <div>
  width: window.innerWidth,
  height: window.innerHeight,
  draggable: true,
});

var layer = new Konva.Layer();

function drawCircle(country: Country) {
  const width = window.innerWidth
  const height = window.innerHeight
  const scaleFactor = 10

  const x = (country.longitude + 180) * (width / 360) * scaleFactor - width;  // Conversión longitud a X
  const y = ((height / 2) - (Math.log(Math.tan((Math.PI / 4) + (country.latitude * Math.PI / 180) / 2)) * (width / (2 * Math.PI))) * scaleFactor) - height;

  var circle = new Konva.Circle({
    x,
    y,
    radius: 5,
    fill: 'white',
  });
  
  // add the shape to the layer
  layer.add(circle);
}

async function loadCountriesOnCanva() {
  try {
    const countries = await getCountries() as Country[]
    countries.forEach((country) => drawCircle(country))
  } catch (error) {
    console.log("Error");
  }
}

loadCountriesOnCanva()


zoom(stage)


stage.add(layer);
stage.draw();

