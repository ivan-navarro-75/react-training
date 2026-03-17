import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { Home } from "./pages/Home";
import styles from "./main.module.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <div className={styles.loading}>Loading...</div>
        }
      >
        <Home />
      </Suspense>
    </QueryClientProvider>
  </StrictMode>,
);
