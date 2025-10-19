import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language/language.service';

interface DemoUser {
  email: string;
  role: string;
  loginTime: string;
  firstName?: string;
  lastName?: string;
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

  constructor() {
    this.loadUserData();
  }

  // Language service methods
  t(key: string): string {
    return this.languageService.t(key);
  }

  // Direct key access for @@ prefixed keys
  getDirectKey(key: string): string {
    return this.languageService.getDirectKey(key);
  }

  get currentLanguage(): string {
    return this.languageService.currentLanguage();
  }

  switchLanguage(lang: 'de' | 'en'): void {
    this.languageService.setLanguage(lang);
    console.log(`Demo: Language switched to ${lang}`);
  }

  private loadUserData(): void {
    const demoUser = sessionStorage.getItem('demoUser');
    if (demoUser) {
      this.currentUser = JSON.parse(demoUser);
    } else {
      // Fallback demo user
      this.currentUser = {
        email: 'demo@demo.com',
        role: 'Demo User',
        loginTime: new Date().toISOString(),
        firstName: 'Demo',
        lastName: 'User'
      };
    }
  }

  // Navigation helpers
  navigateToReports(): void {
    alert(this.t('dashboard.nav.reports') || 'Demo: Reports page would open here');
  }

  navigateToSettings(): void {
    alert(this.t('dashboard.nav.settings') || 'Demo: Settings page would open here');
  }

  // Logout
  logout(): void {
    const confirmMessage = this.t('dashboard.logout.confirm') || 'Are you sure you want to logout?';
    if (confirm(confirmMessage)) {
      sessionStorage.removeItem('demoUser');
      const message = this.t('dashboard.logout.success') || 'Logged out successfully!';
      alert(`Demo: ${message}`);
      // In a real app: this.router.navigate(['/login']);
    }
  }
}
