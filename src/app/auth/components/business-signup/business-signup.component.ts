import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { PhoneNumber } from 'libphonenumber-js'; // Import PhoneNumber
import { tileLayer, latLng, marker, icon, Map, LeafletMouseEvent } from 'leaflet'; // Import necessary Leaflet functions

@Component({
  selector: 'app-business-signup',
  standalone: false,
  templateUrl: './business-signup.component.html',
  styleUrl: './business-signup.component.css'
})
export class BusinessSignupComponent implements OnInit {
  // Forms
  personalInfoForm!: FormGroup;
  serviceDetailsForm!: FormGroup;
  locationForm!: FormGroup;

  phoneControl = new FormControl<PhoneNumber | null>(null, Validators.required);

  // File Uploads
  selectedIdentificationImage: File | null = null;
  selectedGalleryFiles: File[] = [];

  // Stepper Control
  currentStep = 1;
  totalSteps = 3;

  errorMessage: string = '';
  successMessage: string = '';

  // Location Coordinates
  latitude: number = 51.505; // Default coordinates for the map
  longitude: number = -0.09; 

  map: Map | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.personalInfoForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: this.phoneControl,
    });

    this.serviceDetailsForm = this.fb.group({
      categoryId: ['', Validators.required],
      identification: ['', Validators.required],
      description: [''],
      birthDate: ['', Validators.required],
      serviceProviderType: ['', Validators.required],
      identificationImage: [null],
      gallery: [[]],
    });

    this.locationForm = this.fb.group({
      latitude: [this.latitude, Validators.required],
      longitude: [this.longitude, Validators.required],
      km: ['', Validators.required],
      title: ['', Validators.required],
    });

    this.initMap();
  }

 // Add this property to the class
locationMarker: any;

initMap(): void {
  this.map = new Map('map').setView([this.latitude, this.longitude], 13);
  
  tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

  // Try to get current location
  navigator.geolocation.getCurrentPosition(
    (position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;

      this.locationForm.patchValue({
        latitude: this.latitude,
        longitude: this.longitude
      });

      if (this.map) {
        this.map.setView([this.latitude, this.longitude], 13);
        const currentMarker = marker([this.latitude, this.longitude]).addTo(this.map);
        // this.fetchAddress(this.latitude, this.longitude, currentMarker);
      }
      

    },
    (error) => {
      console.error('Geolocation error:', error);
    }
  );

  // Add map click handler
  this.map.on('click', (e: LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    this.latitude = lat;
    this.longitude = lng;

    this.locationForm.patchValue({
      latitude: lat,
      longitude: lng
    });

    if (this.map) {
      const clickedMarker = marker([lat, lng]).addTo(this.map);
      // this.fetchAddress(lat, lng, clickedMarker);
    }
    

    // Reverse geocode
  
  });
}

// fetchAddress(lat: number, lng: number, mapMarker: any): void {
//   const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

//   fetch(url)
//     .then(res => res.json())
//     .then(data => {
//       const address = data.address;
//       const country = address.country || 'Unknown country';
//       const city = address.city || address.town || address.village || 'Unknown city';
//       const fullName = data.display_name;

//       console.log('Country:', country);
//       console.log('City:', city);
//       console.log('Full Address:', fullName);

//       // Optional: display popup
//       mapMarker.bindPopup(`📍 ${fullName}`).openPopup();

//       // Optional: update form or component variables
//       this.locationForm.patchValue({
//         title: fullName
//       });

//     })
//     .catch(err => {
//       console.error('Reverse geocoding failed:', err);
//     });
// }

initLocation(): void {
  // Try to get the current location using geolocation API
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // Get the latitude and longitude
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;

      // Patch the form with latitude and longitude
      this.locationForm.patchValue({
        latitude: this.latitude,
        longitude: this.longitude
      });

      // Fetch the address info using reverse geocoding
      this.fetchAddress(this.latitude, this.longitude);
    },
    (error) => {
      console.error('Geolocation error:', error);
    }
  );
}

// Function to fetch the address using Nominatim (OSM) reverse geocoding
fetchAddress(lat: number, lng: number): void {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const address = data.address;
      const country = address.country || 'Unknown country';
      const city = address.city || address.town || address.village || 'Unknown city';
      const fullName = data.display_name;

      console.log('Country:', country);
      console.log('City:', city);
      console.log('Full Address:', fullName);

      // Update the title field in the locationForm with the full address
      this.locationForm.patchValue({
        title: fullName
      });
    })
    .catch(err => {
      console.error('Reverse geocoding failed:', err);
    });
}



  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
     
    
     if (this.currentStep === 3 && !this.map) {
        setTimeout(() => this.initLocation(), 0);
     }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onIdentificationImageSelected(event: any) {
    this.selectedIdentificationImage = event.target.files[0];
  }

  onGalleryFilesSelected(event: any) {
    this.selectedGalleryFiles = Array.from(event.target.files);
  }

  async submitForm() {
    if (this.personalInfoForm.valid && this.serviceDetailsForm.valid && this.locationForm.valid) {
      this.errorMessage = '';
      const personalInfo = this.personalInfoForm.value;
      const serviceDetails = this.serviceDetailsForm.value;
      const locationData = this.locationForm.value;

      const serviceProviderData = {
        ...personalInfo,
        ...serviceDetails,
        phone: this.phoneControl.value?.number,
      };

      const locationDataToSend = {
        coordinates: [parseFloat(locationData.longitude), parseFloat(locationData.latitude)],
        km: parseFloat(locationData.km),
        title: locationData.title,
      };

      this.authService
        .signUpServiceProvider(
          serviceProviderData,
          locationDataToSend,
          this.selectedIdentificationImage,
          this.selectedGalleryFiles
        )
        .subscribe({
          next: (response) => {
            this.successMessage = 'Signup successful!';
            this.router.navigate(['/login']);
          },
          error: (error) => {
            this.errorMessage = error.error.errors
              ? JSON.stringify(error.error.errors)
              : error.error.error || 'Signup failed.';
          },
        });
    } else {
      this.errorMessage = 'Please ensure all steps are filled correctly.';
    }
  }
}