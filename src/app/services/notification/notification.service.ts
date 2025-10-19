import { Injectable, signal } from '@angular/core';

export interface NotificationData {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // in milliseconds, 0 = no auto-close
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<NotificationData[]>([]);
  private nextId = 1;

  public getNotifications() {
    return this.notifications.asReadonly();
  }

  public show(notification: Omit<NotificationData, 'id'>): void {
    const id = `notification-${this.nextId++}`;
    const newNotification: NotificationData = {
      ...notification,
      id,
      duration: notification.duration ?? 4000 // Default 4 seconds
    };

    this.notifications.update(current => [...current, newNotification]);

    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => this.remove(id), newNotification.duration);
    }
  }

  public success(title: string, message: string, duration?: number): void {
    this.show({ type: 'success', title, message, duration });
  }

  public error(title: string, message: string, duration?: number): void {
    this.show({ type: 'error', title, message, duration: duration ?? 6000 });
  }

  public warning(title: string, message: string, duration?: number): void {
    this.show({ type: 'warning', title, message, duration });
  }

  public info(title: string, message: string, duration?: number): void {
    this.show({ type: 'info', title, message, duration });
  }

  public remove(id: string): void {
    this.notifications.update(current =>
      current.filter(notification => notification.id !== id)
    );
  }

  public clear(): void {
    this.notifications.set([]);
  }
}
