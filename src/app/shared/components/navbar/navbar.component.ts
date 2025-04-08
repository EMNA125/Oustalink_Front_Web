import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // Adjust path if needed

declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';

  constructor(private router: Router, private ngZone: NgZone, private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to login state
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      this.userName = status ? this.authService.getUserName() : '';
    });
  }

  logout(): void {
    this.authService.logout();
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

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  toggleDropdown(event: any) {
    const dropdownMenu = event.target.closest('.dropdown').querySelector('.dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.classList.toggle('show');
    }
  }
}
