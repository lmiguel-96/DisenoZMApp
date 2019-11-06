/*
 * Entry point of the application.
 * Only platform bootstrapping code should be here.
 * For app-specific initialization, use `app/app.component.ts`.
 */

import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@app/app.module';
import { environment } from '@env/environment';
import { hmrBootstrap } from './hmr';
import { ObservableStore } from '@codewithdan/observable-store';

if (environment.production) {
  enableProdMode();
}

ObservableStore.globalSettings = {
  isProduction: environment.production,
  trackStateHistory: !environment.production
  // logStateChanges: !environment.production
};

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if (environment.hmr) {
  hmrBootstrap(module, bootstrap);
} else {
  bootstrap().catch(err => console.error(err));
}
