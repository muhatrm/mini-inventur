import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../services/language/language.service';
import type { NotificationData } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  @Input() notification!: NotificationData;
  @Output() close = new EventEmitter<string>();

  private languageService = inject(LanguageService);

  ngOnInit(): void {
    if (!this.notification) {
      console.error('Toast component requires notification input');
    }
  }

  public t(key: string): string {
    return this.languageService.t(key);
  }

  public getToastClass(): string {
    const baseClass = 'text-bg-';
    switch (this.notification?.type) {
      case 'success': return `${baseClass}success`;
      case 'error': return `${baseClass}danger`;
      case 'warning': return `${baseClass}warning`;
      case 'info': return `${baseClass}info`;
      default: return `${baseClass}secondary`;
    }
  }

  public getIconClass(): string {
    switch (this.notification?.type) {
      case 'success': return 'fas fa-check-circle';
      case 'error': return 'fas fa-exclamation-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'info': return 'fas fa-info-circle';
      default: return 'fas fa-bell';
    }
  }

  public onClose(): void {
    if (this.notification?.id) {
      this.close.emit(this.notification.id);
    }
  }
}
