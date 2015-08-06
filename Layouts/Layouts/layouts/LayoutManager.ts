/// <reference path="controls/Dialog.ts" />


module layouts {
    export class LayoutManager {

        static requestLayoutUpdate() {
            requestAnimationFrame(LayoutManager.updateLayout);
        }


        static updateLayout() {
            var page = Application.current.page;
            var docWidth = document.body.clientWidth;
            var docHeight = document.body.clientHeight;

            if (page != null) {
                var sizeToContentWidth = page.sizeToContent == layouts.SizeToContent.Both || page.sizeToContent == layouts.SizeToContent.Horizontal;
                var sizeToContentHeight = page.sizeToContent == layouts.SizeToContent.Both || page.sizeToContent == layouts.SizeToContent.Vertical;
                page.measure(new Size(sizeToContentWidth ? Infinity : docWidth, sizeToContentHeight ? Infinity : docHeight));
                page.arrange(new Rect(0, 0, sizeToContentWidth ? page.desideredSize.width : docWidth, sizeToContentHeight ? page.desideredSize.height : docHeight));
                page.layout();
            }

            LayoutManager.dialogs.forEach(dialog=> {
                var sizeToContentWidth = dialog.sizeToContent == layouts.SizeToContent.Both || dialog.sizeToContent == layouts.SizeToContent.Horizontal;
                var sizeToContentHeight = dialog.sizeToContent == layouts.SizeToContent.Both || dialog.sizeToContent == layouts.SizeToContent.Vertical;
                dialog.measure(new Size(sizeToContentWidth ? Infinity : docWidth, sizeToContentHeight ? Infinity : docHeight));
                dialog.arrange(new Rect(0, 0, sizeToContentWidth ? dialog.desideredSize.width : docWidth, sizeToContentHeight ? dialog.desideredSize.height : docHeight));
                dialog.layout();
            });

            requestAnimationFrame(LayoutManager.updateLayout);
        }


        private static dialogs: layouts.controls.Dialog[] = [];
        static showDialog(dialog: layouts.controls.Dialog) {
            if (LayoutManager.dialogs.indexOf(dialog) == -1) {
                LayoutManager.dialogs.push(dialog);
                LayoutManager.updateLayout();
            }
        }

        static closeDialog(dialog: layouts.controls.Dialog) {
            var indexOfElement = LayoutManager.dialogs.indexOf(dialog);
            if (indexOfElement > -1) {
                LayoutManager.dialogs.splice(indexOfElement);
                dialog.child = null;
                LayoutManager.updateLayout();
            }
        }
        
    }

    window.onresize = () =>
    {
        LayoutManager.updateLayout();
    };
} 