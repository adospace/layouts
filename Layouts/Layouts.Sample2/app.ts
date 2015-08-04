window.onload = () => {
    var app = new layouts.Application();
    var lmlReader = new layouts.XamlReader();

    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
<Page>
    <div VerticalAlignment="Stretch" HorizontalAlignment="Left">
        <nav>
	        <ul>
		        <li><a href="home.html">Home</a></li>
		        <li>
			        <a href="products.html">Products <span class="caret"></span></a>
			        <div>
				        <ul>
					        <li><a href="products.html#chair">Chair</a></li>
					        <li><a href="products.html#table">Table</a></li>
					        <li><a href="cooker.html">Cooker</a></li>
				        </ul>
			        </div>
		        </li>
		        <li><a href="about.html">About</a></li>
		        <li><a href="help.html">Help</a></li>
	        </ul>
        </nav>
    </div>
</Page>
`;

    app.page = lmlReader.Parse(lmlTest);
};