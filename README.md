# Maintenance Helper (WIP)

Maintenance Helper is a Zendesk app designed to streamline the maintenance workflow, automating tasks such as generating maintenance reports, notifying customers, and creating calendar events. By integrating with various APIs, it automates data collection and processing, reducing manual effort and improving process efficiency.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Local Development](#local-development)
- [Testing](#testing)
- [File Descriptions](#file-descriptions)
- [Contributing](#contributing)

---

## Project Structure

```plaintext
/root
├── assets
│   ├── iframe.html                   # Main entry point in Zendesk iframe context
│   ├── styles/
│   │   ├── main.css                  # Global styles for the app
│   │   ├── button.css                # Button-specific styles
│   │   └── treeview.css              # Tree view rendering styles
│   └── images/                       # Static images for the app (placeholder)
├── main.js                           # Main entry point for the app
├── config.js                         # App configuration
├── modules/                          # Modular feature implementations
│   ├── app_initializer.js            # Handles app initialization
│   ├── data_fetcher.js               # Handles data fetching from APIs
│   ├── event_handler.js              # Manages event listeners and interactions
│   └── treeview_manager.js           # Renders and manages the tree view UI
├── utils/                            # Utility helper functions
│   ├── api.js                        # Generic API utility for HTTP requests
│   ├── debounce.js                   # Debounce utility to optimize event handling
│   └── dom.js                        # DOM manipulation utilities
├── tests/                            # Testing files
│   ├── config.mock.js                # Mock configuration for testing
│   ├── data_fetcher.test.js          # Tests for the data fetching module
│   ├── event_handler.test.js         # Tests for the event handler
│   ├── treeview_manager.test.js      # Tests for tree view rendering
│   └── tests.html                    # Main entry point for running tests
└── README.md                         # Documentation for the app
```

---

## Prerequisites

1. **Zendesk Tools**: You need Zendesk CLI installed to use `zcli`.
   - Installation guide: [Zendesk CLI Documentation](https://developer.zendesk.com/documentation/apps/getting-started/using-zcli/)
2. **Node.js**: Ensure Node.js is installed (version >= 14.17.3 recommended).
3. **Web Browser**: Use a modern web browser (e.g., Chrome, Firefox) for testing.

---

## Installation

Follow these steps to set up the Zendesk App:

1. Clone the repository to your local environment:

   ```bash
   git clone git@github.com:XXX-Technologies/maintenance-helper.git
   cd maintenance-helper
   ```

2. Install Zendesk CLI:

   ```bash
   npm install -g @zendesk/zcli
   ```

3. Authenticate to your Zendesk account with Zendesk CLI:

   ```bash
   zcli login
   ```

4. Ensure the app requires `config.js` and create the following file in the `assets` directory by copying `config.template.js`:

---

## Usage

### In Zendesk

1. Navigate to your configured Zendesk account and enable the app.
2. Open a ticket where the app is enabled in the context panel.
3. Use the app's buttons like **"Fetch Data"** to retrieve and display data in a structured tree view.

---

## Local Development

To run the Zendesk App in your local environment using `zcli`, follow these steps:

1. **Start the local server**:

   Run the following command in the project root directory:

   ```bash
   zcli apps:server
   ```

   This will serve your app locally and open a tunnel to your Zendesk account.

2. **Access the app in Zendesk**:

   - Open your Zendesk instance (e.g., `https://{your_subdomain}.zendesk.com`).
   - Navigate to the ticket interface where the app will be loaded.
   - The app will reflect live changes made in your local environment.

3. **Modify files**:

   - Any changes made to your source files (e.g., `main.js` or `assets/styles/`) will automatically be hot reloaded in the running app instance.

4. **Stop the server**:

   Press `Ctrl+C` to terminate the local development session.

---

## Testing

1. Open the `tests/tests.html` file in your browser to execute tests.

2. Ensure the `config.mock.js` file is loaded to simulate API keys and configurations.

3. Check the browser console for test results:
   - If a test fails, detailed error messages and stack traces will be displayed in the console.

---

## File Descriptions

### App Logic

| File                  | Description                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `main.js`             | Entry point for the app. Initializes app modules and sets up event binding. |
| `data_fetcher.js`     | Handles API calls to Zendesk and external services.                         |
| `event_handler.js`    | Manages DOM events and UI interactions.                                     |
| `treeview_manager.js` | Converts data into a hierarchical tree view for display.                    |

### Utilities

| File          | Description                                                 |
| ------------- | ----------------------------------------------------------- |
| `api.js`      | Wrapper around Zendesk's `client.request` for API requests. |
| `debounce.js` | Utility to prevent spamming event calls.                    |
| `dom.js`      | Simplifies DOM manipulation tasks.                          |

---

## Example Workflow

1. User clicks the **Fetch Data** button.
2. The `event_handler.js` module handles the event.
3. The `data_fetcher.js` module retrieves the ticket ID and fetches relevant data.
4. The fetched data is passed to the `treeview_manager.js` module.
5. The data is displayed as a tree view in the UI.

---

## Contributing

We welcome contributions! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature:

   ```bash
   git checkout -b feature/my-new-feature
   ```

3. Commit your changes and push to the remote branch:

   ```bash
   git push origin feature/my-new-feature
   ```

4. Open a pull request with a detailed description of your changes.

---
