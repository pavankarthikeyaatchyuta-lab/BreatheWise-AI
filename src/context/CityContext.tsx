'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AirQualityState } from '@/lib/types/aqi';
import { getDelhiDemoState, DEMO_CITIES } from '@/lib/aqi/demo-data';

interface CityContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  aqiData: AirQualityState;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<string>('Delhi-NCR');
  const [aqiData, setAqiData] = useState<AirQualityState>(getDelhiDemoState());
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCityData = useCallback(async (city: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/aqi?city=${encodeURIComponent(city)}`);
      if (res.ok) {
        const json: AirQualityState = await res.json();
        setAqiData(json);
      } else {
        // Direct fallback to local profile
        const fallbackFn = DEMO_CITIES[city] || getDelhiDemoState;
        setAqiData(fallbackFn());
      }
    } catch {
      const fallbackFn = DEMO_CITIES[city] || getDelhiDemoState;
      setAqiData(fallbackFn());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCityData(selectedCity);
  }, [selectedCity, fetchCityData]);

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        aqiData,
        loading,
        refreshData: () => fetchCityData(selectedCity),
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return ctx;
}
