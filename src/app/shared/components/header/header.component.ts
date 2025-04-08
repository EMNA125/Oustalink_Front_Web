import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  navigate() {
    throw new Error('Method not implemented.');
    }
    
    
      currentStep = 0;
      selectedFieldSet: number[] = [0];
      nextStep() {
        if (this.selectedFieldSet[0] < 13) {
          this.selectedFieldSet[0]++;
          
        }
        
      }
      previousStep() {
        if (this.selectedFieldSet[0] > 0) {
          // Move to the previous step
          this.selectedFieldSet[0]--;
          
         
        }
      }
      isOffcanvasOpen = false;
    
      toggleOffcanvas() {
        this.isOffcanvasOpen = !this.isOffcanvasOpen;
      }
      closeOffcanvas() {
        this.isOffcanvasOpen = false;
      }
      toggleSidebar() {
        // Logic to toggle the sidebar
      }
    
      hideSidebar() {
        // Logic to hide the sidebar
      }
    }
    