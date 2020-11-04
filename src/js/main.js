import "../scss/main.scss";
import Data from "./data.json";
import Blueprint from './blueprint';

window.onload = _ => {
  // get data
  const data = Data;
  const { bg, points } = data;

  // initialize Blueprint
  const blueprint = new Blueprint(
    document.getElementById('test-wrapper'),
    {
      image  : bg.url,
      width  : bg.sizes.width,
      height : bg.sizes.height  
    },
    {
      points      : points, 
      pointRadius : 10
    }
  );
}