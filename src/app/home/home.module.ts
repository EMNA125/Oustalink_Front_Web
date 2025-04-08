import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { CarouselModule } from 'ngx-owl-carousel-o'; // Ensure this is imported
import { AuthModule } from '../auth/auth.module';
import { HomeComponent } from './components/home/home.component';
import { SharedModule  } from '../shared/shared.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CarouselModule,  // ✅ Import the CarouselModule here
    AuthModule,
    SharedModule
  ],
  exports: [HomeComponent]  // Export HomeComponent if needed outside the module

})
export class HomeModule { }
