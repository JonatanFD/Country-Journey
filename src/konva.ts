import Konva from "konva";
import { City, Route } from "./types";
import { getCities, getRoutes } from "./services/services";

const CANVA = "#canva";


const stage = new Konva.Stage({
    container: CANVA,
    width: window.innerWidth,
    height: window.innerHeight,
})


const layer = new Konva.Layer();


let dataCities = await getCities() as City[]
let dataRoutes = await getRoutes() as Route[]


export const updateDataCities = (cities: City[]) => {
  dataCities = cities;
}

export const getCitiesData = () => {
  return dataCities;
}


