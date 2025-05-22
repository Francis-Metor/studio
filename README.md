
# CampusVote - NextJS Voting Application

This is a Next.js application for a campus voting system, built with React, ShadCN UI, Tailwind CSS, and Genkit for potential AI features. It's designed to work offline by sourcing its primary data from local JSON files.

## Getting Started (Windows)

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes. You'll typically use **Command Prompt** or **PowerShell** for these steps.

### Prerequisites

*   [Node.js](https://nodejs.org/) (version 18.x or later recommended). Download the Windows Installer (.msi) and ensure it's added to your system's PATH (this is usually done by default during installation).
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/) (optional, can be installed via npm: `npm install --global yarn`).

### Installation

1.  **Clone the repository (if applicable) or download and extract the project files.**
    If you have the project files directly (e.g., from a ZIP archive), extract them to a folder on your computer.

2.  **Navigate to the project directory in Command Prompt or PowerShell:**
    Open Command Prompt or PowerShell. Use the `cd` command to change to the directory where you extracted or cloned the project.
    For example, if your project is in `C:\Projects\CampusVote`, you would type:
    ```bash
    cd C:\Projects\CampusVote
    ```

3.  **Install dependencies:**
    Once in the project directory, install all the necessary packages defined in `package.json`.
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```
    This will install Next.js, React, Tailwind, ShadCN components, and Genkit.

### Running the Application Offline

This project is configured to primarily use local JSON files for data (students, candidates, categories, sessions), and core functionalities like student verification have been adapted to work without external AI calls by default.

1.  **Start the Next.js Development Server:**
    This server handles the main application (frontend and Next.js backend features like Server Actions). In your Command Prompt or PowerShell, while in the project directory:
    ```bash
    npm run dev
    ```
    Or using yarn:
    ```bash
    yarn dev
    ```
    The application should now be accessible at [http://localhost:9002](http://localhost:9002) (or another port if 9002 is in use; check your terminal output).

2.  **Start the Genkit Development Server (Optional, for AI features if re-enabled):**
    Genkit is used for AI-related flows. While the student verification currently bypasses AI for offline use, other AI features might be developed. If you intend to work with or test Genkit flows, you'll need to run its development server from a *new* Command Prompt or PowerShell window (also navigated to the project directory).
    ```bash
    npm run genkit:dev
    ```
    Or to watch for changes in Genkit flow files:
    ```bash
    npm run genkit:watch
    ```
    The Genkit development server typically runs on port 4000 and provides a UI at `http://localhost:4000/flows` to inspect and test flows.

    **Note for AI features**: If you re-enable AI features that connect to external services (like Google's Gemini), you would need to provide an API key via an environment variable (e.g., `GEMINI_API_KEY` in a `.env` file in the project root). However, for purely offline operation as currently configured for student verification, this is not required.

### Development

*   **App Pages:** Main application pages are in `src/app`.
*   **Components:** Reusable UI components are in `src/components`.
*   **AI Flows:** Genkit AI logic is in `src/ai/flows`.
*   **Static Data:** JSON data files are located in `src/lib` (e.g., `students-data.json`, `voting-data.json`, `sessions-data.json`).

### Using the Application

*   **Admin Access:**
    *   Username: `admin`
    *   Password: `adminpass`
*   **Student Access:**
    *   Username: `student`
    *   Password: `studentpass`
    *   For student verification, use data from `src/lib/students-data.json`. Examples:
        *   ID: `S1001`, Name: `Alice Johnson` (Eligible)
        *   ID: `S1003`, Name: `Carol Brown` (Voted - Not Eligible)

This setup allows you to run and test the full application on your local machine without needing a live internet connection for its core data-driven features.
