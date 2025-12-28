
# AdaFit

## Project Overview
**AdaFit** is a next-generation, context-aware AI fitness coaching application. Unlike traditional trackers that just log data, AdaFit models your specific constraints—injuries, available equipment, and schedule—to provide adaptive, sustainable fitness guidance.

## Technologies Used
This project is built with a modern, robust frontend stack:
- **Vite**: Next-generation frontend tooling.
- **React**: Library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript for safety and scalability.
- **Material UI (MUI)**: Comprehensive component library for a premium, accessible design system.
- **Recharts**: Composable charting library for React.

## Agents:
START → Context Agent
     ↓
Planner Agent (uses Context + Profile)
     ↓  
Habit Tracker (uses History + Planner)
     ↓
Motivation Coach (uses All 3 + Streak)
     ↓
END → Frontend (reasoning_trail + recommendations)


## Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_GIT_URL>
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd frontend
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

4.  **Start the development server:**
    ```sh
    npm run dev
    ```
    The application will launch at `http://localhost:8080` (or similar).

## Key Features

-   **Dashboard Command Center**: Real-time visualization of streaks, consistency scores, and workout volume.
-   **Deep Profiling**: Detailed tracking of user context including:
    -   *Basic Identity* (Age, Weight, Goals)
    -   *Health Constraints* (Injury tracking, Recovery focus)
    -   *Logistics* (Equipment availability, Preferred times)
-   **Coach Ada (AI Agent)**: A persistent, context-aware chatbot available globally to assist with plan modifications and advice.
-   **Responsive Design**: A fully responsive Progressive Web App (PWA) layout that works seamlessly on Desktop and Mobile.
-   **Local Persistence**: Data is persisted locally, allowing for instant usage and testing.

## Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
=======

