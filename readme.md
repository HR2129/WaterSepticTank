# Water Frontend 💧

This project is a React-based frontend application designed for water management. It provides a user interface for managing master data (like tank types, owner types, contractors, and staff), configuring application settings, and handling various transaction-related tasks such as assigning inspections and generating bills. The application uses a modular architecture with context providers for managing authentication, language, loading state, and master data. It also includes robust error logging and validation mechanisms.

## 🚀 Key Features

- **User Authentication:** Secure user authentication with JWT-based token management.
- **Dynamic Routing:**  `react-router-dom` is used to navigate between different sections of the application.
- **Master Data Management:** Interfaces for managing master data such as tank types, owner types, contractors, and staff.
- **Configuration Management:** Allows administrators to configure application settings.
- **Transaction Handling:** Enables users to perform various transaction-related tasks, such as assigning inspections, creating job assignments, and generating bills.
- **Global Loading State:** Centralized loading state management using React Context.
- **Language Support:**  Manages the application's current language and provides a translation function.
- **Centralized Error Logging:** Captures and logs errors to a backend server for analysis and debugging.
- **Form Validation:** Reusable validation schemas and input handlers for form validation.
- **Dynamic Favicon:** Dynamically updates the favicon based on application state or user preferences.
- **API Abstraction:** Provides a service for making API requests to the backend, including encryption and decryption of data for security.

## 🛠️ Tech Stack

- **Frontend:**
    - React
    - React Router DOM
    - Axios
    - crypto-js
    - Tailwind CSS
    - clsx
    - tailwind-merge
    - Yup
    - jwt-decode
    - bootstrap
- **Build Tool:**
    - Vite
- **Languages:**
    - JavaScript/JSX
    - TypeScript
- **Other:**
    - Node.js
    - npm or yarn

## 📦 Getting Started / Setup Instructions

### Prerequisites

- Node.js (>=16)
- npm or yarn
- A backend API server (configured with the same `API_SECRET` as the frontend)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd Water_Frontend
    ```

2.  Install dependencies:

    ```bash
    npm install # or yarn install
    ```

### Running Locally

1.  Configure the API base URL:

    -   Update the `BASE_API_URL` constant in `Water_Frontend/apiService.js` to point to your backend API server.
    -   Ensure the `API_SECRET` in `Water_Frontend/apiService.js` matches the backend's secret key.
    -   Also, check the backend URL (`http://182.70.112.244:5000/log-error`) in `Water_Frontend/src/logger.jsx` and update it if necessary. Consider using environment variables for configuration.

2.  Start the development server:

    ```bash
    npm run dev # or yarn dev
    ```

    This will start the Vite development server, and you can access the application in your browser at the provided URL (usually `http://localhost:3000`).

## 💻 Project Structure

```
Water_Frontend/
├── src/
│   ├── Components/
│   │   ├── Spinner/
│   │   │   └── Spinner.jsx
│   ├── Context/
│   │   ├── AuthContext.jsx
│   │   ├── LanguageProvider.jsx
│   │   ├── LoaderContext.jsx
│   │   ├── MasterDataContext.jsx
│   ├── HOC/
│   │   ├── ProtectedRoute.jsx
│   │   ├── Validation/
│   │   │   ├── InputValidations.jsx
│   │   │   ├── Validation.jsx
│   │   │   ├── rules.jsx
│   ├── Pages/
│   │   ├── ... (various page components)
│   ├── Hooks/
│   │   ├── useDynamicFavicon.jsx
│   ├── lib/
│   │   ├── utils.ts
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── logger.jsx
├── apiService.js
├── tsconfig.json
├── vite.config.js
├── ... (other configuration files)
```

## 📸 Screenshots

(Add screenshots of the application here to showcase its UI and functionality)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request.

## 📝 License

This project is licensed under the [MIT License](LICENSE) - see the `LICENSE` file for details.

## 📬 Contact

If you have any questions or suggestions, feel free to contact me at dubeyrishi2002@gmail.com
This is written by [readme.ai](https://readme-generator-phi.vercel.app/).
