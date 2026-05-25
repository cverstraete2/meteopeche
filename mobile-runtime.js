(function () {
  const capacitor = window.Capacitor;
  const isNative = Boolean(capacitor?.isNativePlatform?.());

  document.documentElement.classList.toggle("is-native-app", isNative);

  if (!isNative) return;

  window.addEventListener("DOMContentLoaded", () => {
    configureNativeChrome();
    window.setTimeout(hideSplashScreen, 350);
  });

  async function configureNativeChrome() {
    const statusBar = window.capacitorStatusBar?.StatusBar;
    if (!statusBar) return;

    try {
      await statusBar.setStyle({ style: "DARK" });
      await statusBar.setBackgroundColor({ color: "#081511" });
    } catch {
      // Native chrome is best-effort; the web app should still run without it.
    }
  }

  async function hideSplashScreen() {
    try {
      await window.capacitorSplashScreen?.SplashScreen?.hide();
    } catch {
      // SplashScreen is unavailable in plain web previews.
    }
  }
})();
