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
Above style sheet just set some basic layout settings that are required to make *layouts* root element full page sized. Finally add an empty html page with links to above files:
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
Now add the following typescript file (app.ts) to same folder:
```javascript
window.onload = () => {
    var app = new layouts.Application();
    var lmlReader = new layouts.XamlReader();

    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
<Page>
    <Grid Rows="48 *" Columns="Auto *">
        <Border Background="Yellow" Grid.ColumnSpan="2"   />
        <Border Background="Red" Grid.Row="1" Grid.Column="0" Width="80"/>
    </Grid>
</Page>
`;

    app.page = lmlReader.Parse(lmlTest);
};
```


## hello word
