const AppInitializer = function (client) {
  const resizeApp = DomUtils.debounce(function () {
    const appHeight = document.querySelector(".container-div").scrollHeight;
    client.invoke("resize", { width: "100%", height: `${appHeight}px` });
  }, 200);

  async function initializeApp() {
    try {
      DomUtils.observeDOMChanges(
        document.querySelector(".container-div"),
        resizeApp
      );
      resizeApp();
    } catch (error) {
      console.error("Error during app initialization:", error);
      document.getElementById("result-container").innerHTML = `
          <p class="error-message">An error occurred during app initialization. Please refresh and try again.</p>`;
    }
  }

  return {
    initializeApp,
  };
};