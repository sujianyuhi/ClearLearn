import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions {
  immediate?: boolean;
}

export function useApi<T>(
  url: string | null,
  options: UseApiOptions = {}
) {
  const { immediate = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.code !== 200 && result.code !== '200') {
        throw new Error(result.msg || 'API返回错误');
      }

      setData(result.data as T);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (immediate && url) {
      fetchData();
    }
  }, [url, immediate, fetchData]);

  return { data, loading, error, refetch };
}
