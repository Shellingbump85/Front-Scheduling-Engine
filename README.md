# Class Scheduling Engine Frontend

This repository contains the frontend application for the Class Scheduling Engine. It provides a web interface to configure, generate, and visualize automated class schedules based on a mathematical optimization engine.

The application serves as a bridge between the user and the scheduling backend, allowing for the uploading of configuration data, real-time monitoring of job status, and data export.

## Technical Stack

The project is built using modern web technologies focused on performance and type safety:

- Framework: React 18
- Build Tool: Vite
- Language: TypeScript
- Styling: Tailwind CSS and Vanilla CSS
- Communication: Native WebSockets with polling fallback

## Key Functionalities

- Data Upload: Interface for uploading scheduling constraints and parameters in JSON format via drag-and-drop.
- Configuration Management: Tools to adjust solver parameters, penalty weights, and time limits prior to job execution.
- Real-time Monitoring: Status updates via WebSocket connections to track the progress of the optimization process.
- Results Visualization: Structured display of the generated schedule, including detailed assignments and statistics.
- Export Capabilities: Functionality to export the final results into CSV format with UTF-8 encoding.

## Project Structure

The source code is organized as follows:

- src/api: Service layer for HTTP and API communication.
- src/components: Modular UI components such as UploadZone, ConfigPanel, and ResultTable.
- src/hooks: Custom React hooks for job orchestration and data serialization.
- src/types: TypeScript definitions synchronized with the backend schemas.
- src/styles: Global styling and theme configuration.

## Setup and Installation

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

To install the necessary dependencies, execute the following command:

```bash
npm install
```

### Local Development

The application requires the Class Scheduling Engine backend to be active. By default, the frontend expects the backend to be available at http://localhost:8000.

To start the development server:

```bash
npm run dev
```

The application will be accessible at http://localhost:5173.

### Production Build

To generate an optimized production build:

```bash
npm run build
```

## Data Workflow

1. Configuration Input: The user provides a JSON file containing definitions for teachers, subjects, rooms, and timeslots.
2. Parameter Tuning: Optimization parameters such as the solver type and time limits are configured through the UI.
3. Job Initiation: A POST request is sent to the backend, which returns a unique job identifier and a WebSocket URL.
4. Process Monitoring: The application establishes a WebSocket connection to receive status updates. If the connection fails, it automatically falls back to periodic polling.
5. Completion and Export: Upon successful generation, the schedule is presented in a tabular format, enabling the user to export the data for external use.
