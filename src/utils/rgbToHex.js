const clampChannel = (val) => {
  const n = Number(val);
  if (!Number.isFinite(n)) return 0;
  return Math.min(255, Math.max(0, Math.round(n)));
};

const valToHex = (val) => {
  const hex = clampChannel(val).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
};

const rgbToHex = (rgb) => {
  if (!Array.isArray(rgb) || rgb.length < 3) return "#000000";
  return "#" + valToHex(rgb[0]) + valToHex(rgb[1]) + valToHex(rgb[2]);
};

export { rgbToHex };
