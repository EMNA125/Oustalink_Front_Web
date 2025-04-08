import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer,Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
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
  private apiUrl = 'http://localhost:5000'; // backend API
  private refreshInterval: any;

  constructor(private http: HttpClient , private router: Router) { }

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

  signIn(credentials: { email: string, password: string }): Observable<any> {
    return new Observable(observer => {
      this.http.post<any>(`${this.apiUrl}/auth/signin`, credentials).subscribe({
        next: (response) => {
          this.storeSession(response.session);
          this.startAutoRefresh(response.session.expires_in);
          observer.next(response);
        },
        error: (err) => observer.error(err)
      });
    });
  }

  storeSession(session: any) {
    localStorage.setItem('supabaseSession', JSON.stringify(session));
  }

  getSession() {
    const sessionStr = localStorage.getItem('supabaseSession');
    return sessionStr ? JSON.parse(sessionStr) : null;
  }

  logout() {
    localStorage.removeItem('supabaseSession');
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    this.router.navigate(['/login']);
    this.loggedIn.next(false);
  }

  private startAutoRefresh(expiryInSeconds: number) {
    if (this.refreshInterval) clearInterval(this.refreshInterval);

    const refreshDelay = (expiryInSeconds - 60) * 1000; // refresh 1 min before expiry
    this.refreshInterval = setInterval(() => {
      this.refreshToken();
    }, refreshDelay);
  }

  private refreshToken() {
    const session = this.getSession();
    if (!session?.refresh_token) return this.logout();

    this.http.post<any>(`${this.apiUrl}/auth/refresh`, { refresh_token: session.refresh_token }).subscribe({
      next: (response) => {
        this.storeSession(response.session);
        this.startAutoRefresh(response.session.expires_in);
      },
      error: () => this.logout()
    });
  }
  private loggedIn = new BehaviorSubject<boolean>(false); // Default: not logged in

  isLoggedIn$ = this.loggedIn.asObservable();

  login() {
    this.loggedIn.next(true);
  }

 
}
