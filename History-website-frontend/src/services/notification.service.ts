import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  showConfirm?: boolean;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  private confirmSubject = new BehaviorSubject<{ id: string; confirmed: boolean } | null>(null);
  public confirm$: Observable<{ id: string; confirmed: boolean } | null> = this.confirmSubject.asObservable();

  constructor() {}

  /**
   * Afișează o notificare de succes
   */
  showSuccess(title: string, message: string, duration: number = 4000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'success',
      title,
      message,
      duration
    });
  }

  /**
   * Afișează o notificare de eroare
   */
  showError(title: string, message: string, duration: number = 5000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'error',
      title,
      message,
      duration
    });
  }

  /**
   * Afișează o notificare de avertizare
   */
  showWarning(title: string, message: string, duration: number = 4000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'warning',
      title,
      message,
      duration
    });
  }

  /**
   * Afișează o notificare informativă
   */
  showInfo(title: string, message: string, duration: number = 3000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'info',
      title,
      message,
      duration
    });
  }

  /**
   * Afișează un dialog de confirmare
   */
  showConfirm(
    title: string, 
    message: string, 
    confirmText: string = 'Da', 
    cancelText: string = 'Anulează'
  ): Promise<boolean> {
    const id = this.generateId();
    
    this.addNotification({
      id,
      type: 'warning',
      title,
      message,
      showConfirm: true,
      confirmText,
      cancelText
    });

    return new Promise((resolve) => {
      const subscription = this.confirm$.subscribe((result) => {
        if (result && result.id === id) {
          subscription.unsubscribe();
          resolve(result.confirmed);
        }
      });
    });
  }

  /**
   * Răspunde la un dialog de confirmare
   */
  respondToConfirm(id: string, confirmed: boolean): void {
    this.confirmSubject.next({ id, confirmed });
    this.removeNotification(id);
  }

  /**
   * Elimină o notificare
   */
  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(updatedNotifications);
  }

  /**
   * Elimină toate notificările
   */
  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  /**
   * Adaugă o notificare în sistem
   */
  private addNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto-eliminare pentru notificările cu duration
    if (notification.duration && notification.duration > 0 && !notification.showConfirm) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.duration);
    }
  }

  /**
   * Generează un ID unic pentru notificare
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}