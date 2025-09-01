# Data Structure Visualizer - How to Run

This guide will walk you through setting up and running the project on your local machine.

## 🏁 Getting Started

You will need two terminal windows to run both the frontend and backend servers simultaneously.

### Prerequisites

* Make sure you have [Node.js](https://nodejs.org/en/download/) installed. You can check your version with:
    ```sh
    node -v
    ```

---

### Step 1: Install Dependencies

1.  **Open your first terminal** and navigate to the `backend` directory to install its dependencies:
    ```sh
    cd path/to/your/project/backend
    npm install
    ```

2.  **Open your second terminal** and navigate to the `frontend` directory to install its dependencies:
    ```sh
    cd path/to/your/project/frontend
    npm install
    ```

---

### Step 2: Run the Servers

1.  **In your first terminal (the `backend` directory)**, start the backend server:
    ```sh
    npm run dev
    ```
    The server will start and listen on `http://localhost:3000`.

2.  **In your second terminal (the `frontend` directory)**, start the frontend development server:
    ```sh
    npm run dev
    ```
    The application will automatically open in your browser.

---

### Step 3: View the Application

Open your web browser and navigate to the following URL:

[http://localhost:5173](http://localhost:5173)