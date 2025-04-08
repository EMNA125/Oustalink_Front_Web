import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {jwtDecode} from 'jwt-decode';

declare const google: any; // 👈 required to access global Google GSI object

@Component({
  selector: 'app-client-signup',
  standalone: false,
  templateUrl: './client-signup.component.html',
  styleUrls: ['./client-signup.component.css']
})
export class ClientSignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
    });

    // 👇 Initialize Google Sign-In
    google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID',
      callback: (response: any) => this.handleCredentialResponse(response),
    });

    google.accounts.id.renderButton(
      document.getElementById('google-button'),
      {
        theme: 'outline',
        size: 'large',
        text: 'continue_with', // Optional: 'signin_with'
        shape: 'rectangular',
      }
    );
  }

  handleCredentialResponse(response: any): void {
    const jwt = response.credential;
    const userInfo: any = jwtDecode(jwt);
    console.log('Decoded user info:', userInfo);
  
    const clientData = {
      firstname: userInfo.given_name,
      email: userInfo.email,
      phone: '',
      password: 'google-oauth',
      googleid: userInfo.sub
    };
  
    const location = { city: 'default' };
  
    this.authService.signUpClient(clientData, location).subscribe(
      () => {
        alert('Google Sign-Up Successful!');
        this.router.navigate(['/login']);
      },
      () => alert('Error during Google Sign-Up.')
    );
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;
      const clientData = {
        firstname: formData.firstname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        googleid: '',
      };
      const location = { city: 'default' };

      this.authService.signUpClient(clientData, location).subscribe(
        () => {
          alert('Sign-Up Successful!');
          this.router.navigate(['/login']);
        },
        () => alert('Sign-Up Failed')
      );
    } else {
      alert('Please complete the form correctly.');
    }
  }
}
