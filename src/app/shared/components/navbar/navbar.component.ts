import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = 'User'; // You can set it from a service after login

  constructor(private router: Router, private ngZone: NgZone) {}

  ngOnInit(): void {
    // Example check for login — replace with real auth logic
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isLoggedIn = true;
      const storedName = localStorage.getItem('userName');
      if (storedName) this.userName = storedName;
    }
  }

  navigateTo(type: string) {
    const modalElement = document.getElementById('signupModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modalInstance.hide();
      setTimeout(() => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(b => b.remove());
      }, 200);
    }

    setTimeout(() => {
      this.ngZone.run(() => {
        if (type === 'business') {
          this.router.navigate(['/business-signup']);
        } else if (type === 'personal') {
          this.router.navigate(['/personal-signup']);
        }
      });
    }, 300);
  }

  navigateToLogin() {
    this.ngZone.run(() => {
      this.router.navigate(['/login']);
    });
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    this.isLoggedIn = false;
    this.router.navigate(['/']); // Redirect to home or login
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
