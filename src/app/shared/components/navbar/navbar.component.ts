import { Component ,NgZone} from '@angular/core';
import { Router } from '@angular/router';
declare var bootstrap: any; // 👈 Add this

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router, private ngZone: NgZone) {}

  navigateTo(type: string) {
    const modalElement = document.getElementById('signupModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modalInstance.hide();

      // Clean up lingering backdrop (in case Bootstrap misses it)
      setTimeout(() => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(b => b.remove());
      }, 200);
    }

    // Navigate after a slight delay to ensure modal closes fully
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
  
}
