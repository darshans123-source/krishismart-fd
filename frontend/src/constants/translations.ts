import { Language } from '../types';
import en from '../i18n/en.json';
import kn from '../i18n/kn.json';
import hi from '../i18n/hi.json';

/*
  Centralised i18n source of truth.
  The dictionaries live in src/i18n/*.json (one file per language, with
  identical keys — a parity check is part of the i18n work). This module
  only re-exports them so existing imports keep working. English is the
  fallback for any key genuinely missing in Kannada or Hindi.
  Crop names, government scheme names, technical values and official
  abbreviations are intentionally preserved, not translated.
*/
export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: en as Record<string, string>,
  kn: kn as Record<string, string>,
  hi: hi as Record<string, string>
};
