'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  HouseholdProfile,
  DEFAULT_HOUSEHOLD_PROFILE,
  EvaluatorScenarioId,
  EvaluatorScenario,
  EVALUATOR_SCENARIOS,
} from '@/lib/types/user';
import { SupportedLanguage, TRANSLATIONS, Translations } from '@/lib/i18n/translations';

interface ScenarioContextType {
  activeScenarioId: EvaluatorScenarioId | 'DEFAULT';
  activeScenario: EvaluatorScenario | null;
  profile: HouseholdProfile;
  selectScenario: (id: EvaluatorScenarioId) => void;
  resetToDefault: () => void;
  updateProfile: (partial: Partial<HouseholdProfile>) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: keyof Translations) => string;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
  const [activeScenarioId, setActiveScenarioId] = useState<EvaluatorScenarioId | 'DEFAULT'>('DEFAULT');
  const [profile, setProfile] = useState<HouseholdProfile>(DEFAULT_HOUSEHOLD_PROFILE);
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  // Synchronize document root lang attribute for accessibility & screen readers
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const selectScenario = useCallback((id: EvaluatorScenarioId) => {
    const scenario = EVALUATOR_SCENARIOS[id];
    if (scenario) {
      setActiveScenarioId(id);
      setProfile({ ...scenario.profile });
    }
  }, []);

  const resetToDefault = useCallback(() => {
    setActiveScenarioId('DEFAULT');
    setProfile({ ...DEFAULT_HOUSEHOLD_PROFILE });
  }, []);

  const updateProfile = useCallback((partial: Partial<HouseholdProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
    setActiveScenarioId('DEFAULT'); // custom modified
  }, []);

  const t = useCallback(
    (key: keyof Translations): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
      return dict[key] || TRANSLATIONS.en[key] || '';
    },
    [language]
  );

  const activeScenario = useMemo(() => {
    if (activeScenarioId === 'DEFAULT') return null;
    return EVALUATOR_SCENARIOS[activeScenarioId] || null;
  }, [activeScenarioId]);

  return (
    <ScenarioContext.Provider
      value={{
        activeScenarioId,
        activeScenario,
        profile,
        selectScenario,
        resetToDefault,
        updateProfile,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  const ctx = useContext(ScenarioContext);
  if (!ctx) {
    throw new Error('useScenario must be used within a ScenarioProvider');
  }
  return ctx;
}
