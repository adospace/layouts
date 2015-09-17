## panels

I developped *layouts* because I so missed the lack of a powerful element container in HTML. I'm not an expert of HTML so I don't want to dive into but in a moment you'll understand what I mean.

Take for example we want to build a login page: the classic page with username, password boxes and a sign in button.
This the xaml I would write:
```xml
<?xml version="1.0" encoding="utf-8" ?>
<Page>
  <Stack Orientation="Vertical" VerticalAlignment="Center" HorizontalAlignment="Center">
    <TextBlock Text="Welcome to Login Page" Margin="8"/>
    <TextBox Placeholder="User name" Margin="8"/>
    <TextBox Type="password" Placeholder="Password" Margin="8"/>
    <Button Text="Sign In" Margin="8,16,8,8"/>
  </Stack>
</Page>
```
You'll notice some important new components:
* Stack element is a container or panel of other elements. 
* Margin attribute is an attribute that indicates how space should be placed on top, bottom, left and right of element. There are other layout attributes (like padding) that are common to all *layouts* elements and are used by layout algorithm every time it need to compute how much space it requires.

There are other types of panels in *layouts*, for example the most powerful called Grid but you can also create your own Panel that can organize children as you need.

### measure-arrange layout strategy
Everytime *layouts* need to place elements on screen need to measure them and then need to arrande them. In the sample above, *layouts* layoutManager (an internal class) ask the page to measure how much sace it requires. in turn page ask Stack to measure how much space it requires that again in turn ask any child to measure itself. Than back to Page every element return its 'desidered' size. What described so fare is called 'Measure' pass. Second pass of the layout process is called 'Arrange' pass and start always from root element Page. Page arrange child Stack element giving the space it "can" give to it (it can be different from what it desired). In turn Stack panel finally arranges in stack (accordining to its Orientation) its children.

*layouts* elements can be nested. For example using Panels but also using simple one-child container like Border or UserControl that I'll introduce later.

### stack
Stack is a panel that arranges its children like a stack. It has a property called Orientation that describe how children are stacked. Stack is fast and easy to use and will be together with Grid panel your first panel choice.

### grid
Grid is a panell that arranges its children according to a grid layout. Grid is the most powerful builtin panel you can find in layouts but it's also slower that stack so use it only we you need. When you define a Grid you need to specify how many rows and columns it has. By default a Grid is composed of one row and one column. Foreach row/column you should also need to specify its height/width.

A row height or a column width can be specified as fixed value, as a "star" value or as special value "auto":

- Fixed values specify that the row/column should have that value expressed in pixel
- Star values specify that row/column has a width relative to other row/column with star height/width and should divide with them available space. Ok seems complicated but it's not and you'll see in a moment.
- Auto sized rows/columns is the most powerfull value you can set. It means that row/column should be auto-sized with its content, or better whould be tall/large enough to completely contains elements that occupy that row/column. This too seems complex but with an example you'll get the point.

So for example this Grid is composed of 3 rows and 2 columns:
```xml
<?xml version="1.0" encoding="utf-8" ?>
<Grid Rows="* * *" Columns="* *">
</Grid>
```
As you notice 


