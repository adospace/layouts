module layouts {
    export class LayoutManager {

        static requestLayoutUpdate() {
            requestAnimationFrame(LayoutManager.updateLayout);
        }


        static updateLayout() {
            var page = Application.current.page;
            if (page != null) {
                var sizeToContentWidth = page.SizeToContent == layouts.controls.SizeToContent.Both || page.SizeToContent == layouts.controls.SizeToContent.Horizontal;
                var sizeToContentHeight = page.SizeToContent == layouts.controls.SizeToContent.Both || page.SizeToContent == layouts.controls.SizeToContent.Vertical;

                var docWidth = document.body.clientWidth;
                var docHeight = document.body.clientHeight;
                page.measure(new Size(sizeToContentWidth ? Infinity : docWidth, sizeToContentHeight ? Infinity : docHeight));
                page.arrange(new Rect(0, 0, sizeToContentWidth ? page.desideredSize.width : docWidth, sizeToContentHeight ? page.desideredSize.height : docHeight));
                page.layout();

            }

            requestAnimationFrame(LayoutManager.updateLayout);
        }
    }

    window.onresize = () =>
    {
        LayoutManager.updateLayout();
    };
} 