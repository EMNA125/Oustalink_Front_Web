import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'; // Correct import
import { AppModule } from './app/app.module'; // Your AppModule

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
