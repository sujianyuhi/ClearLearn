import { useState, useEffect, useCallback, useRef } from 'react';

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
  const fetchCountRef = useRef(0);

  const fetchData = useCallback(async () => {
    if (!url) return;

    const currentCount = ++fetchCountRef.current;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (currentCount !== fetchCountRef.current) return;

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (currentCount !== fetchCountRef.current) return;

      if (result.code !== 200 && result.code !== '200') {
        throw new Error(result.msg || 'API返回错误');
      }

      setData(result.data as T);
    } catch (err) {
      if (currentCount !== fetchCountRef.current) return;
      setError(err instanceof Error ? err.message : '未知错误');
      setData(null);
    } finally {
      if (currentCount === fetchCountRef.current) {
        setLoading(false);
      }
    }
  }, [url]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (immediate && url) {
      queueMicrotask(fetchData);
    }
  }, [url, immediate, fetchData]);

  return { data, loading, error, refetch };
}
