import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div 
        *ngFor="let notification of notifications" 
        class="notification"
        [class]="'notification-' + notification.type"
        [class.notification-confirm]="notification.showConfirm">
        
        <div class="notification-content">
          <div class="notification-header">
            <div class="notification-icon">
              <span [innerHTML]="getIcon(notification.type)"></span>
            </div>
            <h4 class="notification-title">{{ notification.title }}</h4>
            <button 
              *ngIf="!notification.showConfirm"
              class="notification-close"
              (click)="closeNotification(notification.id)">
              ×
            </button>
          </div>
          
          <p class="notification-message">{{ notification.message }}</p>
          
          <div *ngIf="notification.showConfirm" class="notification-actions">
            <button 
              class="btn btn-confirm"
              (click)="confirmAction(notification.id, true)">
              {{ notification.confirmText || 'Da' }}
            </button>
            <button 
              class="btn btn-cancel"
              (click)="confirmAction(notification.id, false)">
              {{ notification.cancelText || 'Anulează' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./notification-container.component.css']
})
export class NotificationContainerComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => this.notifications = notifications
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeNotification(id: string) {
    this.notificationService.removeNotification(id);
  }

  confirmAction(id: string, confirmed: boolean) {
    this.notificationService.respondToConfirm(id, confirmed);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  }
}