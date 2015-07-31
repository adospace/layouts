
class CodeView {
    private static _border: layouts.controls.Border;

    public static get PAGE_DEFINITION(): string {
        return `<?xml version="1.0" encoding="utf-8" ?>
<Border xmlns:localViews="Layouts.PageEditor">
  <Grid Columns="* *">
    <!-- Ace Editor -->
    <localViews:AceView SourceCode="{sourceCode}"/>

    <!-- Run Area -->
    <Border Name="runAread" Grid.Column="1" Bachground="Green"/>

  </Grid>
</Border>`;
    }


    static getView(): layouts.controls.Border {
        if (CodeView._border == null) {
            let loader = new layouts.LmlReader();
            loader.namespaceResolver = (ns) => {
                if (ns == "Layouts.PageEditor")
                    return null;//means empty namespace (AceView is in global/empty namespace)

                return null;
            };
            CodeView._border = loader.Parse(CodeView.PAGE_DEFINITION);
        }

        return CodeView._border;
    }

}
 