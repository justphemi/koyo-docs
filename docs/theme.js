// Applies the saved theme, or the OS preference, before first paint so the
// page never flashes the wrong colors. Plain script with no dependencies.
// It also exposes a tiny toggle helper used by app.js.
(function () {
  "use strict";

  var STORAGE_KEY = "koyo-docs-theme";

  function readStored() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      return null;
    }
  }

  function writeStored(theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      // Storage can be unavailable in private browsing or sandboxed
      // contexts; the theme still works for this page load.
    }
  }

  function resolveTheme() {
    var stored = readStored();
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    var dark = false;
    try {
      dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (err) {
      dark = false;
    }
    return dark ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  applyTheme(resolveTheme());

  window.KoyoTheme = {
    current: function () {
      return document.documentElement.getAttribute("data-theme") || "light";
    },
    toggle: function () {
      var next = this.current() === "dark" ? "light" : "dark";
      applyTheme(next);
      writeStored(next);
      return next;
    },
  };
})();