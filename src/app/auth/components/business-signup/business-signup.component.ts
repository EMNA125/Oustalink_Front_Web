import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { PhoneNumber } from 'libphonenumber-js'; // Import PhoneNumber
import { tileLayer, latLng, marker, icon, Map, LeafletMouseEvent } from 'leaflet'; // Import necessary Leaflet functions
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-geosearch';
import { HttpClient } from '@angular/common/http';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import provider from 'leaflet-geosearch/dist/providers/provider.js';
import { CategoryService, Category } from '../../../core/services/category.service';
import { CountryISO } from 'ngx-intl-tel-input';
import { PhoneNumberFormat } from 'ngx-intl-tel-input';

// @ts-ignore
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
});

@Component({
  selector: 'app-business-signup',
  standalone: false,
  templateUrl: './business-signup.component.html',
  styleUrl: './business-signup.component.css'
})
export class BusinessSignupComponent implements OnInit {
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  categories: Category[] = [];
  identificationTypes: string[] = ['CIN', 'PERMIT', 'PASSPORT'];

selectIdentification(idType: string) {
  this.serviceDetailsForm.get('identification')?.setValue(idType);
}
serviceProviderTypes: string[] = ['BUSINESS', 'INDIVIDUAL'];

selectServiceProviderType(type: string) {
  this.serviceDetailsForm.get('serviceProviderType')?.setValue(type);
}

  
  // Forms
  personalInfoForm!: FormGroup;
  serviceDetailsForm!: FormGroup;
  locationForm!: FormGroup;
  map: L.Map | undefined;
  marker: L.Marker | undefined;
  circle: L.Circle | undefined;
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


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private categoryService: CategoryService,
    private router: Router,
    private http: HttpClient
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
    this.getCategories();


    this.locationForm = this.fb.group({
      latitude: [this.latitude, Validators.required],
      longitude: [this.longitude, Validators.required],
      km: [1 , Validators.required],
      title: ['', Validators.required],
    });

   // this.initMap();
  }

  getCategories(): void {
    this.categoryService.getAllCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }

  initMap(): void {
    if (this.map) this.map.remove();

    this.map = L.map('map').setView([36.81897, 10.16579], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
    

    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      this.updateMarker(lat, lng);
      this.updateForm(lat, lng);
      this.fetchAddressFromMap(lat, lng);
    });


    const searchControl = GeoSearchControl({
      provider: new OpenStreetMapProvider(),
    });
    
  this.map.addControl(searchControl);
  }

  initLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // Initialize the map if not already done
        if (!this.map) {
          this.initMap(); // or pass coordinates if needed
        }

        this.updateMarker(lat, lng);
        this.updateForm(lat, lng);
        this.fetchAddressFromCoords(lat, lng);
      });
    }
  }

  updateMarker(lat: number, lng: number): void {
    if (!this.map) {
      console.warn('Map not initialized yet.');
      return;
    }
  
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
  
    this.marker = L.marker([lat, lng]).addTo(this.map).bindPopup('You are here!')
    .openPopup();
    this.map.setView([lat, lng], 13);
  
    if (this.circle) {
      this.map.removeLayer(this.circle);
    }
  
    const radius = this.locationForm.get('km')?.value * 1000;
    this.circle = L.circle([lat, lng], {
      radius,
      color: 'blue',
      fillOpacity: 0.2
    }).addTo(this.map);
  }
  

  updateForm(lat: number, lng: number): void {
    this.locationForm.patchValue({
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    });
  }

  onSliderChange(event: any): void {
    const km = +event.target.value;
    this.locationForm.patchValue({ km });
    const lat = parseFloat(this.locationForm.get('latitude')?.value);
    const lng = parseFloat(this.locationForm.get('longitude')?.value);
    if (!isNaN(lat) && !isNaN(lng)) {
      this.updateMarker(lat, lng);
    }
  }

// For initLocation button (uses fetch)
fetchAddressFromCoords(lat: number, lng: number): void {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const address = data.display_name;
      this.locationForm.patchValue({ title: address });
    })
    .catch(err => console.error('Reverse geocoding failed:', err));
}

// For map click (uses Angular HttpClient)
fetchAddressFromMap(lat: number, lng: number): void {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
  this.http.get<any>(url).subscribe((res) => {
    const address = res.display_name;
    this.locationForm.patchValue({ title: address });
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

// initLocation(): void {
//   // Try to get the current location using geolocation API
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       // Get the latitude and longitude
//       this.latitude = position.coords.latitude;
//       this.longitude = position.coords.longitude;

//       // Patch the form with latitude and longitude
//       this.locationForm.patchValue({
//         latitude: this.latitude,
//         longitude: this.longitude
//       });

//       // Fetch the address info using reverse geocoding
//       this.fetchAddress(this.latitude, this.longitude);
//     },
//     (error) => {
//       console.error('Geolocation error:', error);
//     }
//   );
// }

// // Function to fetch the address using Nominatim (OSM) reverse geocoding
// fetchAddress(lat: number, lng: number): void {
//   const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

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

//       // Update the title field in the locationForm with the full address
//       this.locationForm.patchValue({
//         title: fullName
//       });
//     })
//     .catch(err => {
//       console.error('Reverse geocoding failed:', err);
//     });
// }

ngAfterViewInit() {
  // Only initialize the map if the #map div exists in the DOM
  setTimeout(() => {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      this.initMap();
    }
  });
}


  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
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
            // this.authService.storeSession(any,any);
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