/**
 * React Hook for API calls with loading and error states
 */

import { useState, useCallback } from "react";
import { api, ApiClientError } from "../api-client";
import { toast } from "sonner";

interface UseApiOptions {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

export function useApi<T = unknown>(options: UseApiOptions = {}) {
  const { showErrorToast = true, showSuccessToast = false, successMessage } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<T>) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiCall();
        setData(result);
        
        if (showSuccessToast && successMessage) {
          toast.success(successMessage);
        }
        
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof ApiClientError
            ? err.message
            : "An unexpected error occurred";
        setError(errorMessage);
        
        if (showErrorToast) {
          toast.error(errorMessage);
        }
        
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [showErrorToast, showSuccessToast, successMessage]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
}

