## model-view-viewmodel
*layouts* works best if you write code using a MVVM model. I can't here dive too much in MVVM and I'm sure you'll find on internet better resources to learn it. 

*layouts* derives most of its types from DepObject. DepObject provide some basic MVVM functionalities. If you derive a class from DepObject automatically you get some hand features like property changes notifications.

For example say we want to build a fully working login page. Start creating the viewmodel:

