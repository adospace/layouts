
class TestViewModel extends layouts.DepObject {
    static typeName: string = "TestViewModel";
    get typeName(): string {
        return TestViewModel.typeName;
    }

    static nameProperty = layouts.DepObject.registerProperty(TestViewModel.typeName, "name", "test string");
    get name(): string {
        return <string>this.getValue(TestViewModel.nameProperty);
    }
    set name(value: string) {
        this.setValue(TestViewModel.nameProperty, value);
    }

    static countProperty = layouts.DepObject.registerProperty(TestViewModel.typeName, "count", 0, (v) => parseInt(v));
    get count(): number {
        return <number>this.getValue(TestViewModel.countProperty);
    }
    set count(value: number) {
        this.setValue(TestViewModel.countProperty, value);
    }

    private _incrementCommand: layouts.Command;
    get incrementCommand(): layouts.Command {
        if (this._incrementCommand == null)
            this._incrementCommand = new layouts.Command((cmd, p) => this.onIncrement(), (cmd, p) => true);
        return this._incrementCommand;
    }

    onIncrement() {
        this.count++;
    }
}



window.onload = () => {
    var app = new layouts.Application();
    var lmlReader = new layouts.LmlReader();

    //app.page = new TypeScriptUI.testDialog();
    //var testPage = new layouts.controls.Page();
    //testPage.sizeToContent = layouts.controls.SizeToContent.Both;

    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
<Page Name="testPage">  
  <Grid Rows="Auto" Columns="Auto 299" VerticalAlignment="Center" HorizontalAlignment="Center">
      <TextBox Text="{count,twoway}"/>
      <Button Text="Increment" Command="{incrementCommand}" Grid.Column="1"/>
  </Grid>
</Page>`;

    app.page = lmlReader.Parse(lmlTest);
    app.page.dataContext = new TestViewModel();
};