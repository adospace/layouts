## hello word
Add the following typescript file (app.ts) to same folder:
```javascript
window.onload = () => {
    var app = new layouts.Application();
    var page = new layouts.controls.Page();
    var textBlock = new layouts.controls.TextBlock();
    textBlock.text = "Hello World!";
    textBlock.verticalAlignment = layouts.VerticalAlignment.Center;
    textBlock.horizontalAlignment = layouts.HorizontalAlignment.Center;
    page.child = textBlock;
    app.page = page;
};
```
Compile app.ts in app.js then run a browser and open index.html. You should see now your first *layouts* page. Easy no?

Now let examine what really does the script we just added to window.onload callback.
* Create an object called Application. It represent the entire web application, only one object of this type can exists and also accesible using the shortcut Application.current.
* Create a Page object: is the root visual element under which we than can attach any other UI element like texts, panels and so on. Page derives from UIElement, and any other element with an UI derive from UIElement. 
* Create a TextBlock (a block of text literally) is more or less similar to Paragraph html object: actually is rendered by *layouts* as Paragraph object. *layouts* provide many low level UI elements like textblocks, textboxes, buttons and so on and most of them are described in this article.
* Set some properties of textblock so place it centered vertically and horizontally in respect to container (that in this example is the page)
* Finally put everything together setting the textblock as child of the page and the page itself as current page of the application.

## xaml
*layouts* has a powerful tool to build interface starting from xaml (that is a markup language developped by Microsoft similar to HTML but specifically designed to describe UI). 
"Hello world" page above can be easier described in xaml:
```xml
<?xml version="1.0" encoding="utf-8" ?>
<Page>
    <TextBlock Text="Hello World" VerticalAlignment="Center" HorizontalAlignment="Center"/>
</Page>
```
In *layouts* we can use the class XamlReader to load xaml:
```javascript
window.onload = () => {
    var app = new layouts.Application();
    var lmlReader = new layouts.XamlReader();

    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
<Page>
    <TextBlock Text="Hello World" VerticalAlignment="Center" HorizontalAlignment="Center"/>
</Page>
`;
    app.page = lmlReader.Parse(lmlTest);
};
```
Next step is to understand how UIElements work in *layouts*.

