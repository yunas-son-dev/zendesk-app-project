window.config = {
  userEmail: "replace-this-with-your-email",

  environment: "development",

  api: {
    host: "replace-this-with-your-api-host",
    apiKey: "replace-this-with-your-api-key"
  },

  integrations: {
    zendesk: {
      host: "replace-this-with-zendesk-host",
      apiKey: "replace-this-with-zendesk-api-key"
    },

    messaging: {
      host: "replace-this-with-messaging-service-host",
      apiKey: "replace-this-with-messaging-api-key"
    },

    airtable: {
      host: "api.airtable.com",
      baseId: "replace-with-base-id",
      tableName: "replace-with-table-name",
      apiKey: "replace-this-with-airtable-api-key"
    }
  }
};