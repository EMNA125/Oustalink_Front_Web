import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { HomeRoutingModule } from '../home/home-routing.module';
import { SharedRoutingModule } from '../shared/shared-routing.module';
import { FormsModule } from '@angular/forms'; // ✅ Import this for ngModel
import { BusinessSignupComponent } from './components/business-signup/business-signup.component'
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import {  SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import {  ClientSignupComponent } from './components/client-signup/client-signup.component'
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import {  LoginComponent } from './components/login/login.component'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  declarations: [BusinessSignupComponent,ClientSignupComponent,LoginComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    HomeRoutingModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatIntlTelInputComponent,
    SocialLoginModule,
    MatFormFieldModule,
    MatInputModule,
    NgxIntlTelInputModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('YOUR_GOOGLE_CLIENT_ID'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
})
export class AuthModule { }
