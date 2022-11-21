import React, { useState } from "react";
import { rgbToHex } from "../utils/rgbToHex";
import "./Color.style.scss";

const ColorComponent = ({ rgb, weight, type, index }) => {
  const [copyAlert, setCopyAlert] = useState(false);
  const hexCode = rgbToHex(rgb);
  const JOIN_RGB = rgb.join(",");
  const RGB_TEXT = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  const classes = `text-color`;

  return (
    <article
      className={`color`}
      style={{ backgroundColor: `rgb(${JOIN_RGB})` }}
    >
      <h5 className={`${index > 10 ? classes : null}`}>{weight}% </h5>
      <h5 className={`${index > 10 ? classes : null}`}>
        {type.toString().toUpperCase()}
      </h5>
      <h5
        onClick={() => {
          setCopyAlert(true);
          navigator.clipboard.writeText(RGB_TEXT);
        }}
        className={`${index > 10 ? classes : null}`}
      >
        {RGB_TEXT}
      </h5>
      <h5
        onClick={() => {
          setCopyAlert(true);
          navigator.clipboard.writeText(hexCode);
        }}
        className={`${index > 10 ? classes : null}`}
      >
        {hexCode}
      </h5>
      {copyAlert && (
        <h6 className={`${index > 10 ? classes : null}`}>Copied</h6>
      )}
    </article>
  );
};

export default ColorComponent;
