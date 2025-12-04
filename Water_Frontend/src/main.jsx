import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { LanguageProvider } from "./Context/LanguageProvider.jsx";
import { LoaderProvider } from "./Context/LoaderContext.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import Spinner from "./Components/Spinner/Spinner.jsx";
import { MasterDataProvider } from "./Context/MasterDataContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoaderProvider>
      <AuthProvider>
        <MasterDataProvider >
        <LanguageProvider>
          <Spinner />
          <App />
        </LanguageProvider>
        </MasterDataProvider>
      </AuthProvider>
    </LoaderProvider>
  </StrictMode>
);
