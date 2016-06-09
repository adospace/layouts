/// <reference path="controls/Popup.ts" />


module layouts {
    export class LayoutManager {



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

            //docWidth /= window.devicePixelRatio || 1;
            //docHeight /= window.devicePixelRatio || 1;

            if (page != null) {
                var sizeToContentWidth = page.sizeToContent == layouts.SizeToContent.Both || page.sizeToContent == layouts.SizeToContent.Horizontal;
                var sizeToContentHeight = page.sizeToContent == layouts.SizeToContent.Both || page.sizeToContent == layouts.SizeToContent.Vertical;
                page.measure(new Size(sizeToContentWidth ? Infinity : docWidth, sizeToContentHeight ? Infinity : docHeight));
                page.arrange(new Rect(0, 0, sizeToContentWidth ? page.desiredSize.width : docWidth, sizeToContentHeight ? page.desiredSize.height : docHeight));
                page.layout();
            }

            LayoutManager.popups.forEach(popup=> {
                var sizeToContentWidth = popup.sizeToContent == layouts.SizeToContent.Both || popup.sizeToContent == layouts.SizeToContent.Horizontal;
                var sizeToContentHeight = popup.sizeToContent == layouts.SizeToContent.Both || popup.sizeToContent == layouts.SizeToContent.Vertical;
                popup.measure(new Size(sizeToContentWidth ? Infinity : docWidth, sizeToContentHeight ? Infinity : docHeight));
                var relativeTo = popup.parent;
                var left = 0, top = 0;
                var finalWidth = sizeToContentWidth ? popup.desiredSize.width : docWidth;
                var finalHeight = sizeToContentHeight ? popup.desiredSize.height : docHeight;
                if (relativeTo != null && popup.position != layouts.controls.PopupPosition.Center) {
                    var relativeBound = relativeTo.getBoundingClientRect();
                    
                    if (popup.position == layouts.controls.PopupPosition.Left ||
                        popup.position == layouts.controls.PopupPosition.LeftBottom ||
                        popup.position == layouts.controls.PopupPosition.LeftTop) {
                        left = relativeBound.left - finalWidth;
                        if (popup.position == layouts.controls.PopupPosition.Left)
                            top = relativeBound.top + relativeBound.height / 2 - finalHeight / 2;
                        else if (popup.position == layouts.controls.PopupPosition.LeftBottom)
                            top = relativeBound.bottom - finalHeight;
                        else if (popup.position == layouts.controls.PopupPosition.LeftTop)
                            top = relativeBound.top;
                    }
                    else if (popup.position == layouts.controls.PopupPosition.Right ||
                        popup.position == layouts.controls.PopupPosition.RightBottom ||
                        popup.position == layouts.controls.PopupPosition.RightTop) {
                        left = relativeBound.right;
                        if (popup.position == layouts.controls.PopupPosition.Right)
                            top = relativeBound.top + relativeBound.height / 2 - finalHeight / 2;
                        else if (popup.position == layouts.controls.PopupPosition.RightBottom)
                            top = relativeBound.bottom - finalHeight;
                        else if (popup.position == layouts.controls.PopupPosition.RightTop)
                            top = relativeBound.top;
                    }
                    else if (popup.position == layouts.controls.PopupPosition.Top ||
                        popup.position == layouts.controls.PopupPosition.TopLeft ||
                        popup.position == layouts.controls.PopupPosition.TopRight) {
                        top = relativeBound.top - popup.desiredSize.height;
                        if (popup.position == layouts.controls.PopupPosition.Top)
                            left = relativeBound.left + relativeBound.width / 2 - finalWidth / 2;
                        else if (popup.position == layouts.controls.PopupPosition.TopLeft)
                            left = relativeBound.left;
                        else if (popup.position == layouts.controls.PopupPosition.TopRight)
                            left = relativeBound.right - finalWidth;
                    }
                    else if (popup.position == layouts.controls.PopupPosition.Bottom ||
                        popup.position == layouts.controls.PopupPosition.BottomLeft ||
                        popup.position == layouts.controls.PopupPosition.BottomRight) {
                        top = relativeBound.bottom;
                        if (popup.position == layouts.controls.PopupPosition.Bottom)
                            left = relativeBound.left + relativeBound.width / 2 - finalWidth / 2;
                        else if (popup.position == layouts.controls.PopupPosition.BottomLeft)
                            left = relativeBound.left;
                        else if (popup.position == layouts.controls.PopupPosition.BottomRight)
                            left = relativeBound.right - finalWidth;
                    }
                }
                else {
                    left = docWidth / 2 - finalWidth / 2;
                    top = docHeight / 2 - finalHeight / 2;
                }
                popup.arrange(new Rect(left, top, finalWidth, finalHeight));
                popup.layout();
            });
        }


        private static popups: layouts.controls.Popup[] = [];
        static showPopup(popup: layouts.controls.Popup) {
            if (LayoutManager.popups.indexOf(popup) == -1) {
                LayoutManager.popups.push(popup);
                popup.onShow();
                LayoutManager.updateLayout();
            }
        }

        static closePopup(popup?: layouts.controls.Popup) {
            var indexOfElement = popup == null ? LayoutManager.popups.length - 1 : LayoutManager.popups.indexOf(popup);
            if (indexOfElement > -1) {
                popup = LayoutManager.popups.splice(indexOfElement)[0];
                popup.onClose();
                LayoutManager.updateLayout();
            }
        }
        
    }

    window.onresize = () =>
    {
        LayoutManager.updateLayout();
    };
} 