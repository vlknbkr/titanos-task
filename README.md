# TitanOS TV Automation

This project is an end-to-end automation framework for the TitanOS TV. It uses **Playwright** with **JavaScript** to simulate user interactions via a remote control (Arrow keys, Enter, Back) and verifies application state with deterministic, stability-focused assertions.

## Installation

1.  **Prerequisites**: Node.js (v16+ recommended).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Install Playwright browsers**:
    ```bash
    npx playwright install
    ```

## Configuration (`BASE_URL`)

The project uses a `.env` file to define the environment under test.

1.  Create a `.env` file in the root directory (if not present).
2.  Add or update the `BASE_URL` variable:
    ```bash
    BASE_URL=https://....
    ```

## Running Tests

You can run tests in various modes using the standard Playwright CLI.

-   **Run all tests**:
    ```bash
    npx playwright test
    ```

-   **Run a specific test file**:
    ```bash
    npx playwright test tests/favorites.spec.js
    ```

-   **Run in Headed mode** (visualize the browser):
    ```bash
    npx playwright test --headed
    ```

-   **Debug mode** (step-by-step execution):
    ```bash
    npx playwright test --debug
    ```

## Project Structure

The project follows a modular **Page Object Model (POM)** architecture with a dedicated **Flow Layer** for orchestration.

```
src/
├── core/
│   └── BasePage.js        # Base class with global readiness & focus assertions
├── flows/
│   └── FavoritesFlow.js   # Orchestrates multi-page logic
├── locators/
│   └── locators.js        # Centralized dictionary of selector strings
├── pages/                 # Page Objects (Single Responsibility)
│   ├── AppsPage.js
│   ├── ChannelPage.js
│   ├── HomePage.js
│   └── SearchPage.js
└── utils/
    └── RemoteControl.js   # Abstraction for TV remote keys (press, long-press, stabilization)

tests/                     # Spec files
├── channel.spec.js
├── favorites.spec.js
└── search.spec.js
```

## Test Coverage

| Test File | Description |
| **`favorites.spec.js`** | Verifies the "Add to Favorites" and "Remove from Favorites" workflows. Uses `FavoritesFlow` to set up state (e.g., ensure app exists before removing). Cases are running serially to be sure that one are not broke the other. |

| **`search.spec.js`** | Verifies search functionality, including input visibility, category loading, and navigation within search results. |

| **`channel.spec.js`** | Verifies the Channels page availability and correctness of the channel switcher UI. |

## Assertion & Stability Strategy

This framework is designed for a TV, where "readiness" and "focus" are critical.

1.  **Readiness (`waitForSpaReady`)**:
    Instead of hardcoded sleeps, It waits for specific application signals:
    -   Global `#root` visibility.
    -   Absence of global `#loader`.
    -   Page-specific content (e.g., `waitForHomeReady` checks for favorite tiles).

2.  **Focus-Driven Validation**:
    TV apps rely on focus. It asserts state by checking `data-focused` attributes:
    ```javascript
    await this.expectFocused(locator); // Checks data-focused="true" or "focused"
    ```

3.  **Polling (`expect.poll`)**:
    For state that changes asynchronously (like a list item being removed and the count updating), It uses polling instead of static waits:
    ```javascript
    await expect.poll(async () => await list.count()).toBe(0);
    ```

4.  **Remote Stability**:
    The `RemoteControl` class handles key presses with stabilization to prevent "flaky" navigation in virtualized lists.

## Reporting

Playwright generates a comprehensive HTML report after each run.

-   **View the report**:
    ```bash
    npx playwright show-report
    ```

The report includes:
-   Pass/Fail status.
-   Execution time.
-   Screenshots on failure.
-   **Traces**: Full step-by-step execution traces (configured to be retained on first retry or failure), allowing you to "time travel" through the test failure.
