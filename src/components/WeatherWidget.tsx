import { useState, useEffect, useCallback } from 'react';
import { Cloud, CloudRain, Sun, Snowflake, Wind, CloudLightning, CloudFog, Loader2, MapPin, Droplets, Wind as WindIcon } from 'lucide-react';
import type { WeatherLiveData, WeatherApiResponse, IpLocationResponse } from '../types';

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '';

const weatherIconMap: Record<string, React.ReactNode> = {
  '晴': <Sun size={18} className="text-amber" />,
  '多云': <Cloud size={18} className="text-white/70" />,
  '阴': <Cloud size={18} className="text-white/60" />,
  '阵雨': <CloudRain size={18} className="text-sky-300" />,
  '雷阵雨': <CloudLightning size={18} className="text-amber" />,
  '雨': <CloudRain size={18} className="text-sky-300" />,
  '小雨': <CloudRain size={18} className="text-sky-300" />,
  '中雨': <CloudRain size={18} className="text-sky-300" />,
  '大雨': <CloudRain size={18} className="text-sky-300" />,
  '暴雨': <CloudRain size={18} className="text-sky-400" />,
  '雪': <Snowflake size={18} className="text-sky-200" />,
  '小雪': <Snowflake size={18} className="text-sky-200" />,
  '中雪': <Snowflake size={18} className="text-sky-200" />,
  '大雪': <Snowflake size={18} className="text-sky-200" />,
  '雾': <CloudFog size={18} className="text-white/50" />,
  '霾': <CloudFog size={18} className="text-white/50" />,
  '风': <Wind size={18} className="text-white/70" />,
};

function getWeatherIcon(weather: string) {
  for (const key of Object.keys(weatherIconMap)) {
    if (weather.includes(key)) {
      return weatherIconMap[key];
    }
  }
  return <Cloud size={18} className="text-white/70" />;
}

function jsonp<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const callbackName = `amap_jsonp_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const script = document.createElement('script');
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('JSONP请求超时'));
    }, 10000);

    function cleanup() {
      clearTimeout(timeout);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete (window as unknown as Record<string, unknown>)[callbackName];
    }

    (window as unknown as Record<string, unknown>)[callbackName] = (data: T) => {
      cleanup();
      resolve(data);
    };

    const separator = url.includes('?') ? '&' : '?';
    script.src = `${url}${separator}callback=${callbackName}`;
    script.onerror = () => {
      cleanup();
      reject(new Error('JSONP请求失败'));
    };

    document.head.appendChild(script);
  });
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherLiveData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!AMAP_KEY) {
      setError('未配置高德Key');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. 通过IP定位获取城市编码
      const ipData = await jsonp<IpLocationResponse>(
        `https://restapi.amap.com/v3/ip?key=${AMAP_KEY}`
      );

      if (ipData.status !== '1' || !ipData.adcode) {
        throw new Error(ipData.info || 'IP定位失败');
      }

      // 2. 查询天气
      const weatherData = await jsonp<WeatherApiResponse>(
        `https://restapi.amap.com/v3/weather/weatherInfo?key=${AMAP_KEY}&city=${ipData.adcode}&extensions=base`
      );

      if (weatherData.status !== '1' || !weatherData.lives || weatherData.lives.length === 0) {
        throw new Error(weatherData.info || '天气查询失败');
      }

      setWeather(weatherData.lives[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取天气失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  if (!AMAP_KEY) {
    return (
      <div className="mx-3 mb-3 p-3 rounded-xl bg-white/5 border border-white/8">
        <p className="text-[11px] text-white/40 text-center">请在 .env 中配置 VITE_AMAP_KEY</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-3 mb-3 p-3.5 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center gap-2">
        <Loader2 size={13} className="text-amber animate-spin" />
        <span className="text-[11px] text-white/50">获取天气中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-3 mb-3 p-3 rounded-xl bg-white/5 border border-white/8">
        <p className="text-[11px] text-white/50 text-center mb-1.5">{error}</p>
        <button
          onClick={fetchWeather}
          className="w-full text-[11px] py-1 px-2 rounded-lg bg-white/8 text-white/60 hover:bg-white/15 hover:text-white transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="mx-3 mb-3 p-3.5 rounded-xl bg-gradient-to-br from-white/8 to-white/3 border border-white/8 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
            {getWeatherIcon(weather.weather)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-[13px] font-medium text-white/90 truncate">
              <MapPin size={10} className="text-amber/80 flex-shrink-0" />
              <span className="truncate">{weather.city}</span>
            </div>
            <div className="text-[11px] text-white/50 mt-0.5">{weather.weather}</div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xl font-bold text-amber leading-none tracking-tight">
            {weather.temperature}°
          </div>
          <div className="text-[10px] text-white/40 mt-0.5 flex items-center gap-1 justify-end">
            <Droplets size={9} className="text-teal/70" />
            {weather.humidity}%
          </div>
        </div>
      </div>
      <div className="mt-2.5 pt-2.5 border-t border-white/8 flex items-center justify-between text-[10px] text-white/40">
        <span className="flex items-center gap-1">
          <WindIcon size={9} />
          {weather.winddirection}风 {weather.windpower}级
        </span>
        <button
          onClick={fetchWeather}
          className="hover:text-amber/80 transition-colors px-1.5 py-0.5 rounded hover:bg-white/8"
          title="刷新天气"
        >
          刷新
        </button>
      </div>
    </div>
  );
}
