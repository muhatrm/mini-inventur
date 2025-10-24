import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language/language.service';

interface DemoUser {
  email: string;
  role: string;
  loginTime: string;
  firstName?: string;
  lastName?: string;
}

interface Language {
  code: 'de' | 'en';
  name: string;
  flag: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private languageService = inject(LanguageService);

  currentUser: DemoUser | null = null;

  // Dropdown states
  isLanguageDropdownOpen = false;
  isUserDropdownOpen = false;
  isMobileMenuOpen = false;

  // Language array for @for loop
  readonly languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  constructor() {
    this.loadUserData();
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Check if click is outside language dropdown
    if (!target.closest('.language-dropdown-wrapper')) {
      this.isLanguageDropdownOpen = false;
    }

    // Check if click is outside user dropdown
    if (!target.closest('.user-dropdown-wrapper')) {
      this.isUserDropdownOpen = false;
    }
  }

  // Toggle functions
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log('Mobile menu toggled:', this.isMobileMenuOpen);
  }

  toggleLanguageDropdown(event: Event): void {
    event.stopPropagation();
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
    this.isUserDropdownOpen = false; // Close other dropdown
    console.log('Language dropdown toggled:', this.isLanguageDropdownOpen);
  }

  toggleUserDropdown(event: Event): void {
    event.stopPropagation();
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    this.isLanguageDropdownOpen = false; // Close other dropdown
    console.log('User dropdown toggled:', this.isUserDropdownOpen);
  }

  // Language service methods
  t(key: string): string {
    return this.languageService.t(key);
  }

  getDirectKey(key: string): string {
    return this.languageService.getDirectKey(key);
  }

  get currentLanguage(): string {
    return this.languageService.currentLanguage();
  }

  switchLanguage(lang: 'de' | 'en', event: Event): void {
    event.stopPropagation();
    this.languageService.setLanguage(lang);
    this.isLanguageDropdownOpen = false; // Close dropdown after selection
    console.log(`Demo: Language switched to ${lang}`);
  }

  private loadUserData(): void {
    const demoUser = sessionStorage.getItem('demoUser');
    if (demoUser) {
      this.currentUser = JSON.parse(demoUser);
    } else {
      this.currentUser = {
        email: 'demo@demo.com',
        role: 'Demo User',
        loginTime: new Date().toISOString(),
        firstName: 'Demo',
        lastName: 'User'
      };
    }
  }

  navigateToReports(): void {
    this.isMobileMenuOpen = false; // Close mobile menu
    alert(this.t('dashboard.nav.reports') || 'Demo: Reports page would open here');
  }

  navigateToSettings(): void {
    this.isMobileMenuOpen = false; // Close mobile menu
    alert(this.t('dashboard.nav.settings') || 'Demo: Settings page would open here');
  }

  logout(): void {
    const confirmMessage = this.t('dashboard.logout.confirm') || 'Are you sure you want to logout?';
    if (confirm(confirmMessage)) {
      sessionStorage.removeItem('demoUser');
      const message = this.t('dashboard.logout.success') || 'Logged out successfully!';
      alert(`Demo: ${message}`);
      this.isUserDropdownOpen = false;
      this.isMobileMenuOpen = false;
    }
  }
}
