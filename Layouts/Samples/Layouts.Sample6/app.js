window.onload = function () {
    var app = new layouts.Application();
    var loader = new layouts.XamlReader();
    var lmlTest = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<Page Name=\"testPage\">\n    <Stack VerticalAlignment=\"Center\" HorizontalAlignment=\"Center\" Orientation=\"Vertical\" Margin=\"10,20\">\n        <Button Text=\"Test Popup\">\n            <Button.Popup>\n                <Popup Position=\"Bottom\">\n                    <Stack class=\"popup\">\n                        <!--TextBlock Text=\"{title}\" Command=\"{myCommand}\" Margin=\"8\"/-->\n                        <TextBlock Text=\"Menu2\" Command=\"{myCommand}\"  IsVisible=\"{IsEnabled,source:self}\" Margin=\"8\"/>\n                        <TextBlock Text=\"Menu3\" Margin=\"8\"/>\n                    </Stack>\n                </Popup>\n            </Button.Popup>\n        </Button>\n        <Stack HorizontalAlignment=\"Center\" Orientation=\"Horizontal\">\n            <Label For=\"ch\" Text=\"Enable/Disable Command\" Margin=\"4\"/>\n            <CheckBox id=\"ch\" IsChecked=\"{cmdEnabled,mode:twoway}\"/>\n            <a Command=\"{toggleSideBarCommand}\" ArrangeChild=\"false\">\n              <Stack Orientation=\"Horizontal\">\n                <Image class=\"img-circle\" Source=\"../Images/people/user-14.png\" Width=\"32\" Stretch=\"Uniform\"/>\n                <span class=\"font-grey-cararra\" Text=\"{securityService.user.matricola}\" Margin=\"2,0\" VerticalAlignment=\"Center\"/>\n                <i class=\"fa fa-angle-down font-grey-cararra\" VerticalAlignment=\"Center\"/>\n              </Stack>\n            </a>\n        </Stack>\n    </Stack>\n</Page>";
    loader.namespaceResolver = function (ns) {
        if (ns == "localControls")
            return "app";
        return null;
    };
    app.page = loader.Parse(lmlTest);
    app.page.dataContext = new TestViewModel();
};
