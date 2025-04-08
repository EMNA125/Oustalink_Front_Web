import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { SharedRoutingModule } from './shared-routing.module';



@NgModule({
  declarations: [HeaderComponent,NavbarComponent],
  imports: [
    CommonModule, RouterModule,SharedRoutingModule,
  ],
  exports: [HeaderComponent,NavbarComponent],
})
export class SharedModule { }
