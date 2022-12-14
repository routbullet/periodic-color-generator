import React, { useState } from "react";
import Values from "values.js";
import ColorComponent from "../components/Color";
import "./Home.style.scss";

const HomeContainer = () => {
  const [color, setColor] = useState("");
  const [error, setError] = useState(false);
  const [colorList, setColorList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      let newColor = new Values(color).all(10);
      setColorList(newColor);
      setError(false);
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };

  return (
    <>
      <section className="form-section">
        <h2>PERIODIC COLOR GENERATOR</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={color}
            placeholder=" e.g. #fff124, rgb(29,11,14) or blue"
            onChange={(e) => setColor(e.target.value)}
            className={`${error ? "error-value" : null}`}
          />
          <button className="submit-button" type="submit">
            submit
          </button>
        </form>
        <h4>
          You can copy RGB and HEX CODE while click on the text. Thank you!
        </h4>
      </section>
      <section className="colors-section">
        {colorList.map((colors, index) => {
          console.log(colors);
          return <ColorComponent key={index} {...colors} index={index} />;
        })}
      </section>
    </>
  );
};

export default HomeContainer;
