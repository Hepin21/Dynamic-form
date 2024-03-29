## Development server

Make sure to **uncomment** the Bootstrap call in the `src/main.ts` file if it is commented:

```javascript
//platformBrowserDynamic() // uncomment this line
//  .bootstrapModule(AppModule) // uncomment this line
//  .catch((err) => console.error(err)); // uncomment this line
```

Run `npm start` for a dev server. Navigate to `http://localhost:3000/`. The application will automatically reload if you change any of the source files.

## How to generate Web Component?

In the src/main.ts file, you can see the following code:

```javascript
(async () => {
  const app = await createApplication({
    providers: [],
  });
  const dynamicWebComponent = createCustomElement(DynamicFormComponent, {
    injector: app.injector,
  });

  customElements.define("outa-dynamic-form", dynamicWebComponent);
})();
```

which is repsponsible for generating the web component. The `createCustomElement` function is provided by the `@angular/elements` package.

To generate Web Component, make sure to **comment** the Bootstrap call in the `src/main.ts` file:

```javascript
platformBrowserDynamic() // comment this line
  .bootstrapModule(AppModule) // comment this line
  .catch((err) => console.error(err)); // comment this line
```

Run `./script.sh` in Bash to generate the Web Component. The generated `outa-dynamic-form.js` will be available in project root path.
#   D y n a m i c - f o r m  
 