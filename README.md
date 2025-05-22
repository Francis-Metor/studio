
# CampusVote - NextJS Voting Application

This is a Next.js application for a campus voting system, built with React, ShadCN UI, Tailwind CSS, and Genkit for potential AI features. It's designed to work offline by sourcing its primary data from local JSON files.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (version 18.x or later recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository (if applicable) or download the project files.**
    If you have the project files directly, you can skip this step.

2.  **Navigate to the project directory:**
    ```bash
    cd path/to/your/project-folder
    ```

3.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```
    This will install all the necessary packages defined in `package.json`, including Next.js, React, Tailwind, ShadCN components, and Genkit.

### Running the Application Offline

This project is configured to primarily use local JSON files for data (students, candidates, categories, sessions), and core functionalities like student verification have been adapted to work without external AI calls by default.

1.  **Start the Next.js Development Server:**
    This server handles the main application (frontend and Next.js backend features like Server Actions).
    ```bash
    npm run dev
    ```
    Or using yarn:
    ```bash
    yarn dev
    ```
    The application should now be accessible at [http://localhost:9002](http://localhost:9002) (or another port if 9002 is in use, check your terminal output).

2.  **Start the Genkit Development Server (Optional, for AI features if re-enabled):**
    Genkit is used for AI-related flows. While the student verification currently bypasses AI for offline use, other AI features might be developed. If you intend to work with or test Genkit flows, you'll need to run its development server.
    ```bash
    npm run genkit:dev
    ```
    Or to watch for changes in Genkit flow files:
    ```bash
    npm run genkit:watch
    ```
    The Genkit development server typically runs on port 4000 and provides a UI at `http://localhost:4000/flows` to inspect and test flows.

    **Note for AI features**: If you re-enable AI features that connect to external services (like Google's Gemini), you would need to provide an API key via an environment variable (e.g., `GEMINI_API_KEY` in a `.env` file). However, for purely offline operation as currently configured for student verification, this is not required.

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
