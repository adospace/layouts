# layouts
Layouts is a TypeScript library that allows web developers to create complex user interfaces in HTML5

WPF/SL are great libraries for creating UI for desktop and web applications that introduced a number of powerful paradigms I couldn't find in any other JavaScript/TypeScript library out there.
Layouts can be an ideal start for those applications that need to be ported from Silverlight to HTML5 but is flexible enough for build most of projects that require complex user interfaces (like dashboards, graphical designers, single page apps). This means that it's not a "general purpose" framework for every kind of web application.

## getting started
In examples you'll find in this article I use Typescript just because I adopted it to write *layouts* and I found it great. For sake of simplicity I'll omit to describe the compiling process (VS compile TS->JS just before start the browser anyway you can choose the editor/environment you like).
Ok, let's start creating a folder for the project with this files:
layouts.js, layout.js.map, layouts.d.ts, linq.js (get it from layouts project or from nuget or from codeplex)
then add a css file like this:
```css
* {
    margin: 0px;
}

html { 
    height:100%; 
}

body {
    font-family: 'Segoe UI', sans-serif;
    height:100%; 
    margin:0px; 
}
```
Above style sheet just set some basic layout settings that are required to make *layouts* root element full page sized. Finally add an empty html page (index.html) with links to above files:
```html
<!DOCTYPE html>

<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Layouts Hello World</title>
    <link rel="stylesheet" href="app.css" type="text/css" />
    <script src="linq.js" type="text/javascript"></script>
    <script src="App.js" type="text/javascript"></script>
</head>
<body>
</body>
</html>
```
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
1) Create an object called Application. It represent the entire web application, only one object of this type can exists and also accesible using the shortcut Application.current.
2) Create a Page object: is the root visual element under which we than can attach any other UI element like texts, panels and so on. Page derives from UIElement, and any other element with an UI derive from UIElement. 
3) Create a TextBlock (a block of text literally) is more or less similar to Paragraph html object: actually is rendered by *layouts* as Paragraph object. *layouts* provide many low level UI elements like textblocks, textboxes, buttons and so on and most of them are described in this article.
4) Set some properties of textblock so place it centered vertically and horizontally in respect to container (that in this example is the page)
5) Finally put everything together setting the textblock as child of the page and the page itself as current page of the application.



