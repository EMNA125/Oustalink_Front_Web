import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusinessSignupComponent } from '../auth/components/business-signup/business-signup.component';
import { ClientSignupComponent   } from '../auth/components/client-signup/client-signup.component';
import { LoginComponent   } from '../auth/components/login/login.component';

const routes: Routes = [
    { path: 'business-signup', component: BusinessSignupComponent },
    { path: 'personal-signup', component: ClientSignupComponent },
    { path: 'login', component: LoginComponent }, // Default route
    { path: '**', redirectTo: '', pathMatch: 'full' } // Default route
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
