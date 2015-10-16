/// <reference path="controls/Popup.ts" />


module layouts {
    export class LayoutManager {

        static requestLayoutUpdate() {
            requestAnimationFrame(LayoutManager.updateLayout);
        }


        static updateLayout() {
            var page = Application.current.page;
            //var docWidth = document.body.clientWidth;
            var docWidth = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;

            //var docHeight = document.body.clientHeight;
            var docHeight = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;

            

            if (page != null) {
                var sizeToContentWidth = page.sizeToContent == layouts.SizeToContent.Both || page.sizeToContent == layouts.SizeToContent.Horizontal;
                var sizeToContentHeight = page.sizeToContent == layouts.SizeToContent.Both || page.sizeToContent == layouts.SizeToContent.Vertical;
                page.measure(new Size(sizeToContentWidth ? Infinity : docWidth, sizeToContentHeight ? Infinity : docHeight));
                page.arrange(new Rect(0, 0, sizeToContentWidth ? page.desideredSize.width : docWidth, sizeToContentHeight ? page.desideredSize.height : docHeight));
                page.layout();
            }

            LayoutManager.popups.forEach(popup=> {
                var sizeToContentWidth = popup.sizeToContent == layouts.SizeToContent.Both || popup.sizeToContent == layouts.SizeToContent.Horizontal;
                var sizeToContentHeight = popup.sizeToContent == layouts.SizeToContent.Both || popup.sizeToContent == layouts.SizeToContent.Vertical;
                popup.measure(new Size(sizeToContentWidth ? Infinity : docWidth, sizeToContentHeight ? Infinity : docHeight));
                var relativeTo = popup.parent;
                var left = 0, top = 0;
                var finalWidth = sizeToContentWidth ? popup.desideredSize.width : docWidth;
                var finalHeight = sizeToContentHeight ? popup.desideredSize.height : docHeight;
                if (relativeTo != null && popup.position != layouts.controls.PopupPosition.Center) {
                    var relativeBound = relativeTo.getBoundingClientRect();
                    
                    if (popup.position == layouts.controls.PopupPosition.Left) {
                        left = relativeBound.left - finalWidth;
                        top = relativeBound.top + relativeBound.height / 2 - finalHeight / 2;
                    }
                    else if (popup.position == layouts.controls.PopupPosition.Right) {
                        left = relativeBound.right;
                        top = relativeBound.top + relativeBound.height / 2 - finalHeight / 2;
                    }
                    else if (popup.position == layouts.controls.PopupPosition.Top) {
                        top = relativeBound.top - popup.desideredSize.height;
                        left = relativeBound.left + relativeBound.width / 2 - finalWidth / 2;
                    }
                    else if (popup.position == layouts.controls.PopupPosition.Bottom) {
                        top = relativeBound.bottom;
                        left = relativeBound.left + relativeBound.width / 2 - finalWidth / 2;
                    }
                }
                else {
                    left = docWidth / 2 - finalWidth / 2;
                    top = docHeight / 2 - finalHeight / 2;
                }
                popup.arrange(new Rect(left, top, finalWidth, finalHeight));
                popup.layout();
            });

            requestAnimationFrame(LayoutManager.updateLayout);
        }


        private static popups: layouts.controls.Popup[] = [];
        static showPopup(dialog: layouts.controls.Popup) {
            if (LayoutManager.popups.indexOf(dialog) == -1) {
                LayoutManager.popups.push(dialog);
                dialog.onShow();
                LayoutManager.updateLayout();
            }
        }

        static closePopup(dialog?: layouts.controls.Popup) {
            var indexOfElement = dialog == null ? LayoutManager.popups.length - 1 : LayoutManager.popups.indexOf(dialog);
            if (indexOfElement > -1) {
                dialog = LayoutManager.popups.splice(indexOfElement)[0];
                dialog.onClose();
                LayoutManager.updateLayout();
            }
        }
        
    }

    window.onresize = () =>
    {
        LayoutManager.updateLayout();
    };
} 