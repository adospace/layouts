/// <reference path="controls/Dialog.ts" />
var layouts;
(function (layouts) {
    var LayoutManager = (function () {
        function LayoutManager() {
        }
        LayoutManager.requestLayoutUpdate = function () {
            requestAnimationFrame(LayoutManager.updateLayout);
        };
        LayoutManager.updateLayout = function () {
            var page = layouts.Application.current.page;
            var docWidth = document.body.clientWidth;
            var docHeight = document.body.clientHeight;
            if (page != null) {
                var sizeToContentWidth = page.sizeToContent == layouts.SizeToContent.Both || page.sizeToContent == layouts.SizeToContent.Horizontal;
                var sizeToContentHeight = page.sizeToContent == layouts.SizeToContent.Both || page.sizeToContent == layouts.SizeToContent.Vertical;
                page.measure(new layouts.Size(sizeToContentWidth ? Infinity : docWidth, sizeToContentHeight ? Infinity : docHeight));
                page.arrange(new layouts.Rect(0, 0, sizeToContentWidth ? page.desideredSize.width : docWidth, sizeToContentHeight ? page.desideredSize.height : docHeight));
                page.layout();
            }
            LayoutManager.dialogs.forEach(function (dialog) {
                var sizeToContentWidth = dialog.sizeToContent == layouts.SizeToContent.Both || dialog.sizeToContent == layouts.SizeToContent.Horizontal;
                var sizeToContentHeight = dialog.sizeToContent == layouts.SizeToContent.Both || dialog.sizeToContent == layouts.SizeToContent.Vertical;
                dialog.measure(new layouts.Size(sizeToContentWidth ? Infinity : docWidth, sizeToContentHeight ? Infinity : docHeight));
                dialog.arrange(new layouts.Rect(0, 0, sizeToContentWidth ? dialog.desideredSize.width : docWidth, sizeToContentHeight ? dialog.desideredSize.height : docHeight));
                dialog.layout();
            });
            requestAnimationFrame(LayoutManager.updateLayout);
        };
        LayoutManager.showDialog = function (dialog) {
            if (LayoutManager.dialogs.indexOf(dialog) == -1) {
                LayoutManager.dialogs.push(dialog);
                LayoutManager.updateLayout();
            }
        };
        LayoutManager.closeDialog = function (dialog) {
            var indexOfElement = LayoutManager.dialogs.indexOf(dialog);
            if (indexOfElement > -1) {
                LayoutManager.dialogs.splice(indexOfElement);
                dialog.child = null;
                LayoutManager.updateLayout();
            }
        };
        LayoutManager.dialogs = [];
        return LayoutManager;
    })();
    layouts.LayoutManager = LayoutManager;
    window.onresize = function () {
        LayoutManager.updateLayout();
    };
})(layouts || (layouts = {}));
