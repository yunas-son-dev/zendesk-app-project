const DataFetcher = function (client) {

  async function fetchCurrentTicketId() {
    const { ["ticket.id"]: ticketId } = await client.get("ticket.id");
    return ticketId;
  }

  async function fetchExternalSummary(ticketId) {
    const settings = {
      method: "GET",
      url: `https://${config.api.host}/v1/notifications/${ticketId}/summary`,
      headers: {
        "X-API-KEY": config.api.apiKey,
        "X-User-Email": config.userEmail,
      },
    };

    try {
      return await ApiUtils.request(client, settings);
    } catch (error) {
      if (config.environment !== "test") {
        console.error("Error during API request:", error);
      }
      throw error;
    }
  }

  async function fetchRelatedResources(ticketId) {
    const settings = {
      method: "GET",
      url: `https://${config.api.host}/v1/resources/${ticketId}/related`,
      headers: {
        "X-API-KEY": config.api.apiKey,
        "X-User-Email": config.userEmail,
      },
    };

    try {
      return await ApiUtils.request(client, settings);
    } catch (error) {
      console.error("Error fetching related resources:", error);
      throw error;
    }
  }

  async function fetchAirtableData() {
    const settings = {
      method: "GET",
      url: `https://api.airtable.com/v0/${config.airtable.baseId}/${config.airtable.tableName}`,
      headers: {
        Authorization: `Bearer ${config.airtable.apiKey}`,
      },
    };

    try {
      return await ApiUtils.request(client, settings);
    } catch (error) {
      console.error("Error fetching Airtable data:", error);
      throw error;
    }
  }

  return {
    fetchCurrentTicketId,
    fetchExternalSummary,
    fetchRelatedResources,
    fetchAirtableData,
  };
};