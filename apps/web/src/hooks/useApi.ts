import { useCallback, useState } from 'react';
import apiClient from '@/lib/api';
import { AxiosError } from 'axios';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const useApi = () => {
  const [state, setState] = useState<UseApiState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  // GET request
  const get = useCallback(
    async <T = any,>(
      url: string,
      options?: UseApiOptions
    ): Promise<T | null> => {
      try {
        setState({ data: null, loading: true, error: null });
        const response = await apiClient.get<T>(url);
        setState({ data: response.data, loading: false, error: null });
        options?.onSuccess?.(response.data);
        return response.data;
      } catch (error) {
        const message =
          (error as any)?.response?.data?.message || 'Request failed';
        setState({ data: null, loading: false, error: message as string });
        options?.onError?.(message as string);
        return null;
      }
    },
    []
  );

  // POST request
  const post = useCallback(
    async <T = any,>(
      url: string,
      data?: any,
      options?: UseApiOptions
    ): Promise<T | null> => {
      try {
        setState({ data: null, loading: true, error: null });
        const response = await apiClient.post<T>(url, data);
        setState({ data: response.data, loading: false, error: null });
        options?.onSuccess?.(response.data);
        return response.data;
      } catch (error) {
        const message =
          (error as any)?.response?.data?.message || 'Request failed';
        setState({ data: null, loading: false, error: message as string });
        options?.onError?.(message as string);
        return null;
      }
    },
    []
  );

  // PUT request
  const put = useCallback(
    async <T = any,>(
      url: string,
      data?: any,
      options?: UseApiOptions
    ): Promise<T | null> => {
      try {
        setState({ data: null, loading: true, error: null });
        const response = await apiClient.put<T>(url, data);
        setState({ data: response.data, loading: false, error: null });
        options?.onSuccess?.(response.data);
        return response.data;
      } catch (error) {
        const message =
          (error as any)?.response?.data?.message || 'Request failed';
        setState({ data: null, loading: false, error: message as string });
        options?.onError?.(message as string);
        return null;
      }
    },
    []
  );

  // DELETE request
  const delete_ = useCallback(
    async <T = any,>(
      url: string,
      options?: UseApiOptions
    ): Promise<T | null> => {
      try {
        setState({ data: null, loading: true, error: null });
        const response = await apiClient.delete<T>(url);
        setState({ data: response.data, loading: false, error: null });
        options?.onSuccess?.(response.data);
        return response.data;
      } catch (error) {
        const message =
          (error as any)?.response?.data?.message || 'Request failed';
        setState({ data: null, loading: false, error: message as string });
        options?.onError?.(message as string);
        return null;
      }
    },
    []
  );

  return {
    ...state,
    get,
    post,
    put,
    delete: delete_,
  };
};
