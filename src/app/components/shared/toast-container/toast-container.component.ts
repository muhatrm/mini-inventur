import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification/notification.service';
import { ToastComponent } from '../toast/toast.component';
import type { NotificationData } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss']
})
export class ToastContainerComponent {
  public notificationService = inject(NotificationService);

  // Getter für das Template - ruft das Signal auf
  get notifications(): NotificationData[] {
    return this.notificationService.getNotifications()();
  }

  public trackByFn(index: number, notification: NotificationData): string {
    return notification.id || index.toString();
  }

  public onToastClose(id: string): void {
    this.notificationService.remove(id);
  }
}
