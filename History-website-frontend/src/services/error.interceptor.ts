import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Try to inject notification service, but handle gracefully if not available
  let notificationService: NotificationService | null = null;
  try {
    notificationService = inject(NotificationService);
  } catch (e) {
    // NotificationService might not be available in all contexts
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if it's an authentication error
      if (error.status === 401 || error.status === 403) {
        // Check if this is not the login endpoint to avoid infinite loops
        if (!req.url.includes('/login') && !req.url.includes('/validate-token')) {
          
          // Show notification if service is available
          if (notificationService) {
            notificationService.showWarning(
              'Sesiune expirată', 
              'Sesiunea dumneavoastră a expirat. Veți fi redirecționat la pagina de login.'
            );
          }
          
          // Add a small delay to ensure the notification is shown before redirect
          setTimeout(() => {
            // Automatic logout (this will also redirect)
            authService.logout();
          }, 100);
        }
      }

      // Re-throw the error so other error handlers can still process it
      return throwError(() => error);
    })
  );
};