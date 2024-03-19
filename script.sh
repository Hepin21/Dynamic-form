npm run build
cat dist/web-component/{polyfills,runtime,main}.js > ./outa-dynamic-form.js
cp dist/web-component/styles.css ./outa-dynamic-form.css