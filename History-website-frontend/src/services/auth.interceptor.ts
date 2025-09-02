import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  // Skip auth for certain endpoints or if explicitly requested
  const skipAuth = req.headers.has('X-Skip-Interceptor') || 
                   req.url.includes('/confirm/') || 
                   (req.method === 'POST' && req.url.includes('/bookings') && !authService.isAuthenticated());
  
  if (token && !skipAuth) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  
  // Remove the skip header before sending the request
  if (req.headers.has('X-Skip-Interceptor')) {
    const cloned = req.clone({
      headers: req.headers.delete('X-Skip-Interceptor')
    });
    return next(cloned);
  }
  return next(req);
};