(function () {
  const client = ZAFClient.init();

  const appInitializer = AppInitializer(client);
  const eventHandler = EventHandler(client);

  window.addEventListener("load", appInitializer.initializeApp);

  eventHandler.bindEventListeners();
})();