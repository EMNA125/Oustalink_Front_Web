import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeModule } from './home/home.module'
import { CarouselModule } from 'ngx-owl-carousel-o'; // Add CarouselModule here if needed

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app-ousta-link';
}
