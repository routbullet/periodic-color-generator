const valToHex = (val) => {
  let hex = val.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
};

const rgbToHex = (rgb) => {
  return "#" + valToHex(rgb[0]) + valToHex(rgb[1]) + valToHex(rgb[2]);
};

export { rgbToHex };
