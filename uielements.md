## UI elements
*layouts* builds page components using a tree-like arrangement of the UI elements; much like browsers do with html DOM. Actually *layouts* works on top of browser layout system.

If you run the "hello world" sample and open its html source you should see something like this:
```html
<html lang="en">
  <head><..omitted ..></head>
  <body>
  <p style="left: 531.5px; top: 297px; width: 84px; height: 21px; white-space: pre; visibility: visible; position: absolute; -ms-overflow-x: hidden; -ms-overflow-y: hidden; max-height: 615px; max-width: 1147px;">Hello World</p>
  </body>
</html>
```
As you can see *layouts* created a Paragraph (p) object and added it under Body of the HTML document. It also set its position and size and of course its innerhtml to "Hello World!" string. When you resize the browser window you'll see that left,top,width and height are changed accordingly to adjust p position to center vertically and horizontally. Settings stype position attribute to "absolute" we're just telling the browser to not actually calcualte paragraph in its layout cycle because *layouts* just provide the position.

Now let experiment with our xaml trying to set some properties, for example you can try setting HorizontalAlignment to Left or Right.
As *layouts* just render elements as HTML objects you can style them using usual mechanism: CSS. For example if you write a xaml like below:
```xml
<?xml version="1.0" encoding="utf-8" ?>
<Page>
    <TextBlock id="helloworld" Text="Hello World" VerticalAlignment="Center" HorizontalAlignment="Center"/>
</Page>
```
and put a style for element called helloworld in app.css file:
```css
#helloworld {
    color: red;
}
```
you'll get a red text.

Same happen for class attribute:
```xml
<?xml version="1.0" encoding="utf-8" ?>
<Page>
    <TextBlock class="redTexts" Text="Hello World" VerticalAlignment="Center" HorizontalAlignment="Center"/>
</Page>
```
```css
.redTexts {
    color: red;
}
```
In other words you can customize *layouts* elements just any other HTML object because they are just plain HTML objects. Of course you should avoid to change its layout attributes like "position".

Using *layouts* panels that are described in next chapter you should be able to reproduce most if not all layouts your interface require. If you need to change a position of an element using CSS you're probably missing something of how *layouts* works.

