import { Injectable, signal } from '@angular/core';
import enMessages from '../../../locale/messages.en.json';
import deMessages from '../../../locale/messages.de.json';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  // Optional: 'de' oder aus localStorage lesen
  currentLanguage = signal<'de' | 'en'>('de');

  private translations = {
    de: deMessages as any,
    en: enMessages as any,
  };

  t(key: string): string {
    // Direkte @@-Keys aus den JSON-Root-Properties
    if (key.startsWith('@@')) {
      const lang = this.currentLanguage();
      const dict = this.translations[lang];
      return dict[key] ?? key;
    }

    // Verschachtelte Keys: z.B. 'app.title'
    const lang = this.currentLanguage();
    const dict = this.translations[lang];
    const parts = key.split('.');
    let value: any = dict;

    for (const p of parts) {
      if (value && typeof value === 'object' && p in value) {
        value = value[p];
      } else {
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  }

  setLanguage(lang: 'de' | 'en'): void {
    this.currentLanguage.set(lang);
    // Optional: localStorage.setItem('lang', lang);
    // Optional: document.documentElement.lang = lang;
  }

  // Direkter Zugriff für explizite Root-Keys
  getDirectKey(key: string): string {
    const lang = this.currentLanguage();
    const dict = this.translations[lang];
    return dict[key] ?? key;
  }
}
