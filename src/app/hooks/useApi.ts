import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface FetchOptions extends AxiosRequestConfig {
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  post: (endpoint: string, body?: unknown) => Promise<T | null>;
  remove: (endpoint: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

const useApi = <T>(endpoint: string, options: FetchOptions = {}): ApiResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<T> = await axios.get(`${process.env.NEXT_PUBLIC_API}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        ...options,
      });

      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]); // Add dependencies here

  const post = async <B = unknown>(endpoint: string, body?: B): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<T> = await axios.post(`${process.env.NEXT_PUBLIC_API}${endpoint}`, body, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (endpoint: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endpoint && options.method !== 'POST') {
      fetchData();
    }
  }, [endpoint, options.method, fetchData]); // Now fetchData is stable

  return { data, loading, error, post, refetch: fetchData, remove };
};

export default useApi;