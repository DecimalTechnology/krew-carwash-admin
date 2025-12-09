import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SocketProvider from "./context/SocketProvider.tsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <SocketProvider>

                    <App />
                    </SocketProvider>
                </QueryClientProvider>
            </Provider>
        </ThemeProvider>
    </StrictMode>
);
