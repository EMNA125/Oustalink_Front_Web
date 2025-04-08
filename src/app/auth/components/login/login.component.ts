import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signIn() {
    this.authService.signIn(this.credentials).subscribe({
      next: (response) => {
        console.log('✅ Sign in successful', response);

        // Save session to localStorage and start auto-refresh
        this.authService.storeSession(response.session);
        // this.authService.startAutoRefresh(response.session.expires_in);

        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('❌ Sign in failed', error);
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}
