import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const session = this.authService.getSession();

    if (session && session.access_token) {
      // optionally check token expiration here
      return true;
    }

    this.router.navigate(['/login']); // redirect if not logged in
    return false;
  }
}
