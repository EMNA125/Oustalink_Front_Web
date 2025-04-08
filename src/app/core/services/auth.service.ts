import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

interface SignUpResponse {
  message?: string;
  user?: any;
  identificationImageUrl?: string;
  galleryUrls?: string[];
}

interface SignInResponse {
  message: string;
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  };
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000';
  private refreshInterval: any;

  // Auth state management
  private loggedIn = new BehaviorSubject<boolean>(this.hasSession());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // === SIGN UP ===
  signUpServiceProvider(serviceProviderData: any, location: any, identificationImage: File | null, galleryFiles: File[]): Observable<SignUpResponse> {
    const formData = new FormData();
    formData.append('serviceProviderData', JSON.stringify(serviceProviderData));
    formData.append('location', JSON.stringify(location));
    if (identificationImage) formData.append('identificationImage', identificationImage);
    galleryFiles.forEach(file => formData.append('gallery', file));

    return this.http.post<SignUpResponse>(`${this.apiUrl}/auth/signup`, formData);
  }

  signUpClient(clientData: any, location: any): Observable<SignUpResponse> {
    const formData = new FormData();
    formData.append('clientData', JSON.stringify(clientData));
    formData.append('location', JSON.stringify(location));
    return this.http.post<SignUpResponse>(`${this.apiUrl}/auth/signup`, formData);
  }

  // === SIGN IN ===
  signIn(credentials: { email: string, password: string }): Observable<any> {
    return new Observable(observer => {
      this.http.post<SignInResponse>(`${this.apiUrl}/auth/signin`, credentials).subscribe({
        next: (response) => {
          this.storeSession(response.session, response.user);
          this.startAutoRefresh(response.session.expires_in);
          observer.next(response);
        },
        error: (err) => observer.error(err)
      });
    });
  }

  // === SESSION MANAGEMENT ===
  storeSession(session: any, user: any) {
    localStorage.setItem('supabaseSession', JSON.stringify(session));
    localStorage.setItem('userName', user?.name || 'User');
    this.loggedIn.next(true);
  }

  getSession() {
    const sessionStr = localStorage.getItem('supabaseSession');
    return sessionStr ? JSON.parse(sessionStr) : null;
  }

  getUserName(): string {
    return localStorage.getItem('userName') || '';
  }

  private hasSession(): boolean {
    return !!localStorage.getItem('supabaseSession');
  }

  logout() {
    localStorage.removeItem('supabaseSession');
    localStorage.removeItem('userName');
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  // === TOKEN REFRESH ===
  private startAutoRefresh(expiryInSeconds: number) {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    const refreshDelay = (expiryInSeconds - 60) * 1000;
    this.refreshInterval = setInterval(() => {
      this.refreshToken();
    }, refreshDelay);
  }

  private refreshToken() {
    const session = this.getSession();
    if (!session?.refresh_token) return this.logout();

    this.http.post<any>(`${this.apiUrl}/auth/refresh`, { refresh_token: session.refresh_token }).subscribe({
      next: (response) => {
        this.storeSession(response.session, response.user);
        this.startAutoRefresh(response.session.expires_in);
      },
      error: () => this.logout()
    });
  }
}
