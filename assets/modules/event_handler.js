// event_handler.js (restored & integrated with DataFetcher)

const EventHandler = function (client) {
  // --- Services -------------------------------------------------------------
  const dataFetcher = DataFetcher(client);

  // --- Public: bind all UI event listeners ---------------------------------
  function bindEventListeners() {
    document
      .getElementById("uai-data-button")
      ?.addEventListener("click", onFetchButtonClick);

    document
      .getElementById("airtable-data-button")
      ?.addEventListener("click", fetchAndRenderAirtableData);

    document
      .getElementById("combined-fetch-button")
      ?.addEventListener("click", combinedFetchButton);
  }

  // --- UAI FLOW (original baseline) ----------------------------------------
  async function onFetchButtonClick() {
    const resultContainer = document.getElementById("result-container");
    if (!resultContainer) {
      console.error("Result container is missing in the DOM.");
      return;
    }

    resultContainer.textContent = "Fetching data...";

    try {
      const ticketId = await dataFetcher.fetchCurrentTicketId();
      const uAiData = await dataFetcher.fetchUAiData(ticketId);

      // Render UAI tree view (original behavior)
      TreeViewManager.renderTreeView(uAiData, resultContainer);
    } catch (error) {
      console.error("Error during fetch operation:", error.message);
      resultContainer.textContent = "Failed to fetch data. Please try again.";
    }
  }

  // --- Combined flow (UAI + Airtable) --------------------------------------
  async function combinedFetchButton() {
    const resultContainer = document.getElementById("result-container");
    if (!resultContainer) {
      console.error("Result container is missing in the DOM.");
      return;
    }

    // 1) UAI
    await onFetchButtonClick();
    // 2) Airtable
    await fetchAndRenderAirtableData();
  }

  // --- Airtable helpers -----------------------------------------------------
  function filterAirtableFields(responseData, wantedFields) {
    return responseData.records.map((record) => {
      const filteredFields = {};
      wantedFields.forEach((field) => {
        let value = record.fields[field];
        if (field === "Slack Channel" && typeof value === "string") {
          value = value.split(",")[0].trim(); 
        }
        filteredFields[field] = value;
      });
      return filteredFields;
    });
  }

  function extractASIDs(matchedMachines) {
    if (
      matchedMachines &&
      matchedMachines.machineGroups &&
      matchedMachines.machineGroups.grouped
    ) {
      return Object.keys(matchedMachines.machineGroups.grouped).filter(
        (id) => id && id !== "unknown" && id !== "undefined"
      );
    }
    return [];
  }

  // --- Airtable main --------------------------------------------------------
  async function fetchAndRenderAirtableData() {
    const host = document.getElementById("result-container");
    if (!host) {
      console.error("Result container is missing in the DOM.");
      return;
    }

    // Ensure container exists once
    let containerEl = document.getElementById("airtable-container");
    if (!containerEl) {
      containerEl = document.createElement("div");
      containerEl.id = "airtable-container";
      containerEl.style.marginTop = "30px";
      containerEl.style.borderTop = "1px solid #ccc";

      const title = document.createElement("h2");
      title.textContent = "Customer Data"; 
      title.style.marginBottom = "15px";

      containerEl.appendChild(title);
      host.appendChild(containerEl);
    }

    containerEl.innerHTML = "<p>Loading customer information...</p>";

    try {
      // 1) Get ticket & matched machines → ASIDs
      const ticketId = await dataFetcher.fetchCurrentTicketId();
      const matchedMachines = await dataFetcher.getMatchedMachines(ticketId);
      console.log("Using matched machines data:", matchedMachines);

      const targetASIDs = extractASIDs(matchedMachines);
      console.log("Found ASIDs from matched machines:", targetASIDs);

      if (targetASIDs.length === 0) {
        containerEl.innerHTML = "<p>No ASIDs found in matched machines.</p>";
        return;
      }

      // 2) Fetch Airtable
      const responseData = await dataFetcher.fetchAirtableData();
      if (!responseData?.records) {
        containerEl.innerHTML =
          "<p>No matched customer data found (Airtable returned no records).</p>";
        return;
      }

      const wantedFields = [
        "Organization for DSE",
        "Name (from Project)",
        "Account Service ID (from ASID)",
        "Slack Channel",
        "DSE Customer Specific Notes",
      ];
      const filteredArray = filterAirtableFields(responseData, wantedFields);

      // 3) Match by ASID
      const foundASIDs = [];
      const notFoundASIDs = [];

      const resultForASIDs = targetASIDs
        .map((targetASID) => {
          const matched = filteredArray.find(
            (r) =>
              String(r["Account Service ID (from ASID)"]) === String(targetASID)
          );

          console.log(
            `ASID ${targetASID} match found:`,
            matched ? "YES" : "NO"
          );

          if (!matched) {
            notFoundASIDs.push(targetASID);
            return null;
          }

          foundASIDs.push(targetASID);
          return {
            Organization: matched["Organization for DSE"],
            "Project Name": matched["Name (from Project)"],
            ASID: matched["Account Service ID (from ASID)"],
            "Slack Channel": matched["Slack Channel"],
            "DSE customer specific notes": matched["DSE Customer Specific Notes"],
          };
        })
        .filter(Boolean);

      // 4) Build UI
      let html = `
        <!-- Controls row: (Select All + Send) -->
        <div style="display:flex; justify-content:flex-end; align-items:center; gap:14px; margin-bottom:16px;">
          <label style="user-select:none; cursor:pointer; display:flex; align-items:center; gap:8px;">
            <input type="checkbox" id="selectAllCheckbox" />
            <span>Select All</span>
          </label>
          <button id="sendMessageBtn" style="padding:8px 12px; background-color:#1976d2; color:#fff; border:none; border-radius:6px; cursor:pointer;">
            Send a message
          </button>
        </div>
      `;

      if (resultForASIDs.length > 0) {
        html += resultForASIDs
          .map((item) => {
            const projectName = Array.isArray(item["Project Name"])
              ? item["Project Name"].join(", ")
              : item["Project Name"] || "-";

            const asid = Array.isArray(item.ASID)
              ? item.ASID.join(", ")
              : item.ASID || "-";

            const slack = item["Slack Channel"] || "-";

            const rawNotes = item["DSE customer specific notes"];
            const notes =
              typeof rawNotes === "string"
                ? rawNotes.trim()
                : Array.isArray(rawNotes)
                ? rawNotes.join(", ").trim()
                : "";

            return `
              <div class="collapsible-container" style="margin-bottom:8px; border:1px solid #ccc; border-radius:8px;">
                <div class="collapsible-header" style="display:flex; align-items:center; justify-content:space-between; padding:6px; background-color:#f5f5f5; cursor:pointer;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <input type="checkbox" class="asid-checkbox" data-asid="${asid}" data-slack="${slack}">
                    <span class="toggle-icon" style="margin-right:8px;">▼</span>
                    <span class="header-title" style="flex-grow:1;"><strong>ASID: ${asid}</strong></span>
                  </div>
                </div>
                <div class="collapsible-content" style="display:none; padding:5px; border-top:1px solid #ccc;">
                  <p style="margin-top:5px;"><strong>🔹 Org:</strong> ${item.Organization || "-"}</p>
                  <p><strong>🔹 Proj:</strong> ${projectName}</p>
                  <p><strong>🔹 Slack:</strong> ${slack}</p>
                  ${
                    notes
                      ? `
                    <p><strong>🔹 DSE Notes:</strong></p>
                    <div style="margin-left:1.5em; margin-top:8px;">
                      <textarea style="width:100%; resize:vertical;" rows="4" readonly>${notes}</textarea>
                    </div>
                  `
                      : ""
                  }
                </div>
              </div>
            `;
          })
          .join("");
      } else {
        html += "<p>No matched customer data found.</p>";
      }

      // Not-found section
      if (notFoundASIDs.length > 0) {
        html += `
          <div style="margin-top:20px; padding:10px; background-color:#f0f0f0; border-radius:6px; font-size:0.9em; color:#555;">
            ${notFoundASIDs
              .map(
                (asid) =>
                  `<div style="padding:4px 0;">ASID: <strong>${asid}</strong> - No customer data found for this ASID.</div>`
              )
              .join("")}
          </div>
        `;
      }

      containerEl.innerHTML = html;

      // 5) Wire up interactions
      // Collapse toggle 
      document
        .querySelectorAll("#airtable-container .collapsible-header")
        .forEach((header) => {
          header.addEventListener("click", (e) => {
            if (e.target?.tagName === "INPUT") return;
            const content = header.nextElementSibling;
            const icon = header.querySelector(".toggle-icon");
            if (content.style.display === "none" || content.style.display === "") {
              content.style.display = "block";
              if (icon) icon.textContent = "▲";
            } else {
              content.style.display = "none";
              if (icon) icon.textContent = "▼";
            }
          });
        });

      // Select All
      const selectAllCheckbox = document.getElementById("selectAllCheckbox");
      if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener("change", (e) => {
          const checked = e.target.checked;
          document
            .querySelectorAll("#airtable-container .asid-checkbox")
            .forEach((cb) => {
              cb.checked = checked;
            });
        });
      }

      // Send a message → console.log only selected items
      const sendBtn = document.getElementById("sendMessageBtn");
      if (sendBtn) {
        sendBtn.addEventListener("click", () => {
          const checkedData = Array.from(
            document.querySelectorAll("#airtable-container .asid-checkbox:checked")
          ).map((checkbox) => ({
            ASID: checkbox.getAttribute("data-asid"),
            Slack: checkbox.getAttribute("data-slack"),
          }));
          console.log("Selected ASID & Slack Channel:", checkedData);
        });
      }
    } catch (error) {
      console.error("Error during Airtable fetch operation:", error.message);
      containerEl.innerHTML = `<p class="error">Failed to fetch customer data: ${error.message}</p>`;
    }
  }

  // --- Exports --------------------------------------------------------------
  return {
    bindEventListeners,
  };
};