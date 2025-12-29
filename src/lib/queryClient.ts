import { QueryClient } from "@tanstack/react-query";

// Create query client with offline-first strategy
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});
