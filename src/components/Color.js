import React, { useState } from "react";
import { rgbToHex } from "../utils/rgbToHex";
import "./Color.style.scss";

const ColorComponent = ({ rgb, weight, index }) => {
  const [alert, setAlert] = useState(false);
  const hexCode = rgbToHex(rgb);
  const JOIN_RGB = rgb.join(",");
  const RGB_TEXT = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;

  return (
    <article
      className={`color`}
      style={{ backgroundColor: `rgb(${JOIN_RGB})` }}
    >
      <h6 className={`${index > 10 ? "text-color" : null}`}>{weight}%</h6>
      <h6
        onClick={() => {
          setAlert(true);
          navigator.clipboard.writeText(RGB_TEXT);
        }}
        className={`${index > 10 ? "text-color" : null}`}
      >
        {RGB_TEXT}
      </h6>
      <h6
        onClick={() => {
          setAlert(true);
          navigator.clipboard.writeText(hexCode);
        }}
        className={`${index > 10 ? "text-color" : null}`}
      >
        {hexCode}
      </h6>
      {alert && (
        <h6 className={`${index > 10 ? "text-color" : null}`}>Copied</h6>
      )}
    </article>
  );
};

export default ColorComponent;
