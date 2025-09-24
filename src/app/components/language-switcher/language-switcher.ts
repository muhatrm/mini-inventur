import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-language-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css'
})
export class LanguageSwitcher {
  // Öffentlich, damit Template Zugriff hat
  public languageService = inject(LanguageService);

  public isOpen = false;

  // Getter für aktuelle Sprache
  public get current() {
    return this.languageService.currentLanguage();
  }

  // Dropdown öffnen/schließen
  public toggle() {
    this.isOpen = !this.isOpen;
  }

  // Sprache wechseln
  public select(lang: 'de' | 'en') {
    this.languageService.setLanguage(lang);
    this.isOpen = false;
  }

  // Klick außerhalb schließt Dropdown
  @HostListener('document:click')
  public close() {
    this.isOpen = false;
  }
}
