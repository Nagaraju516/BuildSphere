import { describe, it, expect } from 'vitest';
import enTranslations from '../locales/en.json';
import teTranslations from '../locales/te.json';
import hiTranslations from '../locales/hi.json';

function getNestedValue(obj: any, path: string): string | undefined {
  if (!obj) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

function getAllKeys(obj: any, prefix = ''): string[] {
  const keys: string[] = [];
  for (const k of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys.push(...getAllKeys(obj[k], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

describe('BuildSphere Multilingual Translation Engine', () => {
  const enKeys = getAllKeys(enTranslations);

  it('contains comprehensive translation keys across all 6 modules', () => {
    expect(enKeys.length).toBeGreaterThan(100);
  });

  it('has 100% complete Telugu (te) translation parity without missing keys', () => {
    const missingTe: string[] = [];
    for (const key of enKeys) {
      if (getNestedValue(teTranslations, key) === undefined) {
        missingTe.push(key);
      }
    }
    expect(missingTe).toEqual([]);
  });

  it('has 100% complete Hindi (hi) translation parity without missing keys', () => {
    const missingHi: string[] = [];
    for (const key of enKeys) {
      if (getNestedValue(hiTranslations, key) === undefined) {
        missingHi.push(key);
      }
    }
    expect(missingHi).toEqual([]);
  });
});
