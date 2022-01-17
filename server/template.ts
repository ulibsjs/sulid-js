export const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
    <script type="module" src="/server/entry.tsx" defer></script>
    <!-- bundle -->
    <script>window.__PROPS__ = <!-- props --></script>
  </head>
  <body>
    <div id="app"><!-- page-html --></div>
    <!-- hydrant -->
  </body>
</html>`
