import { describe, it, expect } from 'vitest';
import { TRANSLATIONS, SupportedLanguage, Translations } from '../src/lib/i18n/translations';

describe('Trilingual i18n Localization Integrity Suite', () => {
  const languages: SupportedLanguage[] = ['en', 'hi', 'te'];
  const baseKeys = Object.keys(TRANSLATIONS.en) as (keyof Translations)[];

  it('contains dictionaries for all 3 supported languages', () => {
    expect(TRANSLATIONS).toHaveProperty('en');
    expect(TRANSLATIONS).toHaveProperty('hi');
    expect(TRANSLATIONS).toHaveProperty('te');
  });

  languages.forEach((lang) => {
    describe(`Language Dictionary: ${lang.toUpperCase()}`, () => {
      it(`has 100% key parity with base English dictionary (zero missing keys)`, () => {
        const currentKeys = Object.keys(TRANSLATIONS[lang]) as (keyof Translations)[];
        expect(currentKeys.sort()).toEqual(baseKeys.sort());
      });

      it(`has non-empty string values for every translation entry`, () => {
        const dict = TRANSLATIONS[lang];
        baseKeys.forEach((key) => {
          const val = dict[key];
          expect(typeof val).toBe('string');
          expect(val.trim().length).toBeGreaterThan(0);
        });
      });
    });
  });

  it('preserves universal scientific terms in regional translations', () => {
    // Both Hindi and Telugu translations must preserve technical terms where appropriate
    expect(TRANSLATIONS.hi.officialMeasuredBadge).toContain('CPCB');
    expect(TRANSLATIONS.te.scientificDisclaimer).toBeTruthy();
    expect(TRANSLATIONS.hi.scientificDisclaimer).toBeTruthy();
  });
});
