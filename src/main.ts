import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { DynamicFormComponent } from './app/dynamic-form/dynamic-form.component';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

// (async () => {
//   const app = await createApplication({
//     providers: [],
//   });
//   const dynamicWebComponent = createCustomElement(DynamicFormComponent, {
//     injector: app.injector,
//   });

//   customElements.define('outa-dynamic-form', dynamicWebComponent);
// })();
