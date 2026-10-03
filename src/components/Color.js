import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { rgbToHex } from "../utils/rgbToHex";
import "./Color.style.scss";

const isLightColor = (rgb) => {
  if (!Array.isArray(rgb) || rgb.length < 3) return false;
  const [r, g, b] = rgb;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62;
};

const legacyCopyFallback = (text) => {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
};

const copyText = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return legacyCopyFallback(text);
  } catch {
    return legacyCopyFallback(text);
  }
};

const ColorComponent = memo(function ColorComponent({
  rgb,
  weight,
  type,
  index = 0,
  onCopied,
}) {
  const [copiedKind, setCopiedKind] = useState(null);
  const timer = useRef(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const hexCode = rgbToHex(rgb);
  const rgbText = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  const light = isLightColor(rgb);
  const delay = `${Math.min(index * 35, 350)}ms`;

  const flash = useCallback(
    (kind, text) => {
      setCopiedKind(kind);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopiedKind(null), 1600);
      if (onCopied) onCopied(text);
    },
    [onCopied]
  );

  const handleCopy = useCallback(
    async (kind) => {
      const text = kind === "hex" ? hexCode : rgbText;
      const ok = await copyText(text);
      if (ok) flash(kind, text);
    },
    [flash, hexCode, rgbText]
  );

  return (
    <article
      className="color"
      data-theme={light ? "light" : "dark"}
      style={{
        backgroundColor: rgbText,
        animationDelay: delay,
      }}
    >
      <div className="color-meta">
        <span className="color-weight">{weight}%</span>
        <span className="color-type">{String(type).toUpperCase()}</span>
      </div>
      <div className="color-actions">
        <button
          type="button"
          className="copy-btn"
          onClick={() => handleCopy("hex")}
          aria-label={`Copy hex value ${hexCode}`}
          title="Click to copy HEX"
        >
          <span className="copy-value">{hexCode}</span>
          <span className="copy-hint">
            {copiedKind === "hex" ? "Copied" : "HEX · Copy"}
          </span>
        </button>
        <button
          type="button"
          className="copy-btn"
          onClick={() => handleCopy("rgb")}
          aria-label={`Copy rgb value ${rgbText}`}
          title="Click to copy RGB"
        >
          <span className="copy-value copy-value--small">{rgbText}</span>
          <span className="copy-hint">
            {copiedKind === "rgb" ? "Copied" : "RGB · Copy"}
          </span>
        </button>
      </div>
    </article>
  );
});

export default ColorComponent;
