import { ApplicationRef, CUSTOM_ELEMENTS_SCHEMA, DoBootstrap, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent],
    // bootstrap: [],

  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [BrowserModule, DynamicFormComponent], //Add DynamicFormComponent Because of Standalone Compo...
})
export class AppModule {}


// export class AppModule implements DoBootstrap{ 

//   constructor(private injector: Injector){}

//   ngDoBootstrap(appRef : ApplicationRef): void {
//       const Form = createCustomElement(DynamicFormComponent,{injector: this.injector});
//       customElements.define('add-webc', Form);   //*Use for Create and Register Custom Web Component     direct ng build and compile this component
//       // const showTodos = createCustomElement(TodosComponent,{injector: this.injector});
//       // customElements.define('show-todos', showTodos);   //*Use for Create and Register Custom Web Component
//       // const about = createCustomElement(AboutComponent,{injector: this.injector});
//       // customElements.define('about-todos', about);   //*Use for Create and Register Custom Web Component
//   }
//  }