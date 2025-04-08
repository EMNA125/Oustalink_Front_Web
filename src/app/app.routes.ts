import { Routes } from '@angular/router';
import { HomeComponent } from './home/components/home/home.component';

export const routes: Routes = [ 
    { path: 'home', component: HomeComponent },
    {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then(
            (m) => m.HomeModule
          ),
      },
];