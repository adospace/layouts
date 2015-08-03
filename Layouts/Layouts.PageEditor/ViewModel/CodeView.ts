
class CodeView {

    public static get PAGE_DEFINITION(): string {
        return `<?xml version="1.0" encoding="utf-8" ?>
<Border xmlns:localViews="Layouts.PageEditor">
  <Grid Columns="* *">
    <!-- Ace Editor -->
    <localViews:AceView SourceCode="{sourceCode,twoway}"/>

    <!-- Run Area -->
    <Border Name="runAread" Grid.Column="1">
        <ControlTemplate Content="{createdControl}"/>
    </Border>

  </Grid>
</Border>`;
    }


    static getView(): layouts.controls.Border {
        let loader = new layouts.XamlReader();
        loader.namespaceResolver = (ns) => {
            if (ns == "Layouts.PageEditor")
                return null;//means empty namespace (AceView is in global/empty namespace)

            return null;
        };
        return loader.Parse(CodeView.PAGE_DEFINITION);
    }

}
 