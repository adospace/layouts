## UI elements
*layouts* builds page components using a tree-like arrangement of the UI elements; much like browsers do with html DOM. Actually *layouts* works on top of browser layout system.
If you run the "hello world" cample and open its html source you should see something like this:
```html
<html lang="en">
  <head><..omitted ..></head>
  <body>
  <p style="left: 531.5px; top: 297px; width: 84px; height: 21px; white-space: pre; visibility: visible; position: absolute; -ms-overflow-x: hidden; -ms-overflow-y: hidden; max-height: 615px; max-width: 1147px;">Hello World</p>
  </body>
</html>
```
As you can see *layouts* created a Paragraph (p) object and added it under Body of the HTML document. It also set its position and size and of course its innerhtml to "Hello World!" string. When you resize the browser window you'll see that left,top,width and height are changed accordingly to adjust p position to center vertically and horizontally. Settings stype position attribute to "absolute" we're just telling the browser to not actually calcualte paragraph in its layout cycle because *layouts* just provide the position.
