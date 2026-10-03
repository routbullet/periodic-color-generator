import React, { useCallback, useEffect, useRef, useState } from "react";
import Values from "values.js";
import ColorComponent from "../components/Color";
import "./Home.style.scss";

const PRESETS = [
  { name: "Teal", value: "#14b8a6" },
  { name: "Coral", value: "#fb7185" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Amber", value: "#f59e0b" },
];

const HomeContainer = () => {
  const [color, setColor] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [colorList, setColorList] = useState([]);
  const [toast, setToast] = useState("");
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine
  );
  const toastTimer = useRef(null);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    []
  );

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    const onSwUpdate = () => setUpdateAvailable(true);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    window.addEventListener("pwa-update", onSwUpdate);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("pwa-update", onSwUpdate);
    };
  }, []);

  const showToast = useCallback((text) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1600);
  }, []);

  const handleCopied = useCallback(
    (text) => {
      showToast(text);
    },
    [showToast]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const input = color.trim();
      if (!input) {
        setError(true);
        setErrorMsg("Enter a color — try #14b8a6, rgb(20, 184, 166) or teal.");
        return;
      }
      try {
        const palette = new Values(input).all(10);
        setColorList(palette);
        setError(false);
        setErrorMsg("");
      } catch {
        setError(true);
        setErrorMsg(
          `"${input}" isn't a valid color. Try a HEX, RGB or color name.`
        );
      }
    },
    [color]
  );

  const handlePreset = useCallback((value) => {
    setColor(value);
    setError(false);
    setErrorMsg("");
  }, []);

  return (
    <div className="home">
      <section className="hero" aria-labelledby="hero-title">
        <p className="hero-badge">
          <span className="pulse-dot" aria-hidden="true" />
          Offline-ready PWA · Tints &amp; shades in one tap
        </p>
        <h1 id="hero-title">Periodic Color Generator</h1>
        <p className="hero-sub">
          Type any HEX, RGB or color name — get a full palette and click a
          value to copy it.
        </p>

        <form
          onSubmit={handleSubmit}
          className={error ? "color-form has-error" : "color-form"}
          noValidate
        >
          <div className="field">
            <span
              className="preview-dot"
              style={{ backgroundColor: color || "transparent" }}
              aria-hidden="true"
            />
            <input
              type="text"
              value={color}
              placeholder="#14b8a6, rgb(20, 184, 166) or teal"
              onChange={(e) => setColor(e.target.value)}
              className={error ? "error-value" : ""}
              aria-invalid={error}
              aria-describedby={error ? "form-error" : undefined}
              aria-label="Color to generate palette from"
              autoComplete="off"
              spellCheck="false"
            />
            <button className="submit-button" type="submit">
              Generate
            </button>
          </div>
          {error && (
            <p id="form-error" className="form-error" role="alert">
              {errorMsg}
            </p>
          )}
        </form>

        <div className="presets" aria-label="Try a preset color">
          <span className="presets-label">Try:</span>
          {PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              className="preset-chip"
              onClick={() => handlePreset(p.value)}
              title={`Use ${p.value}`}
            >
              <span
                className="preset-dot"
                style={{ backgroundColor: p.value }}
                aria-hidden="true"
              />
              {p.name}
            </button>
          ))}
        </div>

        <div className="hero-meta">
          {colorList.length > 0 ? (
            <p>
              {colorList.length} shades · click any HEX or RGB value to copy
            </p>
          ) : (
            <p>Your palette will appear below — nothing generated yet.</p>
          )}
          {!isOnline && (
            <p className="offline-note" role="status">
              You&apos;re offline — the app still works from cache.
            </p>
          )}
        </div>
      </section>

      {updateAvailable && (
        <div className="update-bar" role="status">
          <span>A new version is available.</span>
          <button type="button" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      )}

      {colorList.length === 0 ? (
        <section className="empty-state" aria-label="No palette yet">
          <div className="empty-grid" aria-hidden="true">
            {PRESETS.map((p) => (
              <span
                key={p.value}
                style={{ backgroundColor: p.value }}
                className="empty-swatch"
              />
            ))}
          </div>
          <h2>Start with any color</h2>
          <p>
            Enter a value above or tap a preset chip — valid inputs include{" "}
            <code>#8b5cf6</code>, <code>rgb(139, 92, 246)</code> or{" "}
            <code>violet</code>.
          </p>
        </section>
      ) : (
        <section className="colors-section" aria-label="Generated palette">
          {colorList.map((c, index) => (
            <ColorComponent
              key={`${c.rgb.join(",")}-${index}`}
              rgb={c.rgb}
              weight={c.weight}
              type={c.type}
              index={index}
              onCopied={handleCopied}
            />
          ))}
        </section>
      )}

      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {toast && <div className="toast">Copied {toast}</div>}
      </div>

      <footer className="app-footer">
        <span className="credit">
          Crafted with care by <strong>Bullet Rout</strong> · ©{" "}
          {new Date().getFullYear()} ·{" "}
          <a href="mailto:routbullet@gmail.com">routbullet@gmail.com</a>
        </span>
        <span className="meta">
          Built with React · installable PWA · works offline
          {colorList.length > 0 ? ` · ${colorList.length} shades` : ""}
        </span>
      </footer>
    </div>
  );
};

export default HomeContainer;
