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
