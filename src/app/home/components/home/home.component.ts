import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public blogslider: OwlOptions = {
    loop: true,
    margin: 24,
    nav: true,
    dots: false,
    smartSpeed: 2000,
    navText: ["<i class='fa-solid fa-angle-left'></i>", "<i class='fa-solid fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 1
      },

      550: {
        items: 2
      },
      700: {
        items: 2
      },
      1000: {
        items: 4
      }
    }
  };
  public testimonialsliderOwlOptions: OwlOptions = {
    loop: true,
    margin: 24,
    nav: true,
    dots: false,
    smartSpeed: 2000,
    navText: ["<i class='ti ti-chevron-left'></i>", "<i class='ti ti-chevron-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      992: {
        items: 2
      },
      1000: {
        items: 3
      }
    }
  };
  public popularsliderOwlOptions: OwlOptions = {
    loop: false,
    margin: 24,
    nav: true,
    dots: false,
    smartSpeed: 2000,
    navText: ["<i class='fa-solid fa-angle-left'></i>", "<i class='fa-solid fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      550: {
        items: 2
      },
      700: {
        items: 2
      },
      1000: {
        items: 3
      }
    }
  };
  public servicesliderOwlOptions: OwlOptions = {
    loop: false,
    margin: 24,
    nav: true,
    dots: true,
    smartSpeed: 2000,
    navText: ["<i class='fa-solid fa-angle-left'></i>", "<i class='fa-solid fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      550: {
        items: 2
      },
      700: {
        items: 2
      },
      1000: {
        items: 3
      }
    }
  };
  public imagesliderOwlOptions: OwlOptions = {
    loop: false,
    margin: 24,
    nav: true,
    dots: true,
    smartSpeed: 2000,
    navText: ["<i class='fa-solid fa-angle-left'></i>", "<i class='fa-solid fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      550: {
        items: 2
      },
      700: {
        items: 2
      },
      1000: {
        items: 3
      }
    }
  };
  public featuresliderOwlOptions: OwlOptions = {
    loop: false,
    margin: 24,
    nav: true,
    dots: false,
    smartSpeed: 2000,
    navText: ["<i class='fa-solid fa-angle-left'></i>", "<i class='fa-solid fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      550: {
        items: 2
      },
      700: {
        items: 2
      },
      1000: {
        items: 3
      }
    }
  };
  currentStep = 0;
  selectedFieldSet: number[] = [0];
  progressWidth: string = '8.33333%';
  progressValue: number = 0;
  nextStep() {
    if (this.selectedFieldSet[0] < 13) {
      this.selectedFieldSet[0]++;
    }
    
  }
  services: any[] = []; // <-- define services here
}

