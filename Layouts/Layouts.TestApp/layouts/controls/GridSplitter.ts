/// <reference path="..\DepProperty.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="Panel.ts" />

module layouts.controls {
    export class GridSplitter extends Border {
        static typeName: string = "layouts.controls.GridSplitter";
        get typeName(): string {
            return GridSplitter.typeName;
        }

        constructor() {
            super();
            FrameworkElement.classProperty.overrideDefaultValue(GridSplitter.typeName, "gridSplitter");
        }

        attachVisualOverride(elementContainer: HTMLElement) {
            super.attachVisualOverride(elementContainer);

            this._visual.style.zIndex = "10000";
            this._visual.addEventListener("mousedown", (ev) => this.onSplitterMouseDown(ev), true);
            (<any>this._visual).tag = this;
            this._visual.onselectstart = function () { return false };
            
            this.updateCursor();
        }

        private onSplitterMouseDown(ev: MouseEvent) {
            this.initializeDrag(ev);
        }

        private updateCursor() {
            if (this._visual == null) {
                this._visual.style.cursor = "normal";
                return;
            }
            if (this.verticalAlignment == VerticalAlignment.Top ||
                this.verticalAlignment == VerticalAlignment.Bottom)
                this._visual.style.cursor = "n-resize";
            else if (this.horizontalAlignment == HorizontalAlignment.Left ||
                this.horizontalAlignment == HorizontalAlignment.Right)
                this._visual.style.cursor = "e-resize";
            else
                this._visual.style.cursor = Consts.stringEmpty;
        }
    
        ///Grid splitter
        private _draggingCurrentPoint = new Vector();
        private _draggingStartPoint = new Vector();
        private _draggingVirtualOffset = new Vector();
        private _draggingVirtualOffsetMin = new Vector();
        private _draggingVirtualOffsetMax = new Vector();

        private initializeDrag(ev: MouseEvent) {
            var parentGrid = <Grid>this.parent;
            if (parentGrid == null)
                return;

            //if element has no layout, returns
            if (this.visualOffset == null)
                return;

            var dragging = false;
            var leftColumnWidth = 0;
            var rightColumnWidth = 0;
            var topRowHeight = 0;
            var bottomRowHeight = 0;

            if (this.verticalAlignment == VerticalAlignment.Top) {
                var thisRowIndex = Grid.getRow(this);
                thisRowIndex = Math.min(thisRowIndex, parentGrid.rows.count - 1);
                dragging = thisRowIndex > 0 && parentGrid.rows.count > 1;
                if (dragging) {
                    topRowHeight = parentGrid.getRowFinalHeight(thisRowIndex - 1) - parentGrid.getRows().at(thisRowIndex - 1).minHeight;
                    bottomRowHeight = parentGrid.getRowFinalHeight(thisRowIndex) - parentGrid.getRows().at(thisRowIndex).minHeight;
                }
            }
            else if (this.verticalAlignment == VerticalAlignment.Bottom) {
                var thisRowIndex = Grid.getRow(this);
                thisRowIndex = Math.min(thisRowIndex, parentGrid.rows.count - 1);
                dragging = thisRowIndex >= 0 && parentGrid.rows.count > 1;
                if (dragging) {
                    topRowHeight = parentGrid.getRowFinalHeight(thisRowIndex) - parentGrid.getRows().at(thisRowIndex).minHeight;
                    bottomRowHeight = parentGrid.getRowFinalHeight(thisRowIndex + 1) - parentGrid.getRows().at(thisRowIndex + 1).minHeight;
                }
            }
            else if (this.horizontalAlignment == HorizontalAlignment.Left) {
                var thisColIndex = Grid.getColumn(this);
                thisColIndex = Math.min(thisColIndex, parentGrid.columns.count - 1);
                dragging = thisColIndex > 0 && parentGrid.columns.count > 1;
                if (dragging) {
                    leftColumnWidth = parentGrid.getColumnFinalWidth(thisColIndex - 1) - parentGrid.getColumns().at(thisColIndex - 1).minWidth;
                    rightColumnWidth = parentGrid.getColumnFinalWidth(thisColIndex) - parentGrid.getColumns().at(thisColIndex).minWidth;
                }
            }
            else if (this.horizontalAlignment == HorizontalAlignment.Right) {
                var thisColIndex = Grid.getColumn(this);
                thisColIndex = Math.min(thisColIndex, parentGrid.columns.count - 1);
                dragging = thisColIndex >= 0 && parentGrid.columns.count > 1;
                if (dragging) {
                    leftColumnWidth = parentGrid.getColumnFinalWidth(thisColIndex) - parentGrid.getColumns().at(thisColIndex).minWidth;
                    rightColumnWidth = parentGrid.getColumnFinalWidth(thisColIndex + 1) - parentGrid.getColumns().at(thisColIndex + 1).minWidth;
                }
            }

            if (dragging) {
                //register to mouse events
                document.addEventListener("mousemove", this.onSplitterMouseMove, false);
                document.addEventListener("mouseup", this.onSplitterMouseUp, false);

                //calculate starting vectors and min/max values for _draggingCurrentPointX
                this._draggingStartPoint.x = this._draggingCurrentPoint.x = ev.x;
                this._draggingStartPoint.y = this._draggingCurrentPoint.y = ev.y;
                this._draggingVirtualOffset.x = this.visualOffset.x;
                this._draggingVirtualOffset.y = this.visualOffset.y;

                if (this.horizontalAlignment == HorizontalAlignment.Left ||
                    this.horizontalAlignment == HorizontalAlignment.Right) {
                    this._draggingVirtualOffsetMin.x = this.visualOffset.x - leftColumnWidth;
                    this._draggingVirtualOffsetMax.x = this.visualOffset.x + rightColumnWidth;
                }
                else {
                    this._draggingVirtualOffsetMin.y = this.visualOffset.y - topRowHeight;
                    this._draggingVirtualOffsetMax.y = this.visualOffset.y + bottomRowHeight;
                }

                ev.stopPropagation();
            }
        }

        private _dragSplitterTimeoutHandle: number;

        private onSplitterMouseMove = (ev: MouseEvent) => {
            if (ev.buttons == 0) {
                document.removeEventListener("mousemove", this.onSplitterMouseMove, false);
                document.removeEventListener("mouseup", this.onSplitterMouseUp, false);
            }
            else //if (ev.target == this._visual)
                this.moveGhost(ev);

            ev.stopPropagation();
        }

        private moveGhost(ev: MouseEvent) {
            var evX = ev.x;
            var evY = ev.y;

            if (this.horizontalAlignment == HorizontalAlignment.Right ||
                this.horizontalAlignment == HorizontalAlignment.Left) {
                var evXmax = this._draggingVirtualOffsetMax.x - this._draggingVirtualOffset.x + this._draggingCurrentPoint.x;
                var evXmin = this._draggingVirtualOffsetMin.x - this._draggingVirtualOffset.x + this._draggingCurrentPoint.x;
                if (evX > evXmax)
                    evX = evXmax;
                if (evX < evXmin)
                    evX = evXmin;
                this._draggingVirtualOffset.x += (evX - this._draggingCurrentPoint.x);
            }
            else {
                var evYmax = this._draggingVirtualOffsetMax.y - this._draggingVirtualOffset.y + this._draggingCurrentPoint.y;
                var evYmin = this._draggingVirtualOffsetMin.y - this._draggingVirtualOffset.y + this._draggingCurrentPoint.y;
                if (evY > evYmax)
                    evY = evYmax;
                if (evY < evYmin)
                    evY = evYmin;
                this._draggingVirtualOffset.y += (evY - this._draggingCurrentPoint.y);
            }

            if (this.visualOffset != null) {
                this._visual.style.left = this._draggingVirtualOffset.x.toString() + "px";
                this._visual.style.top = this._draggingVirtualOffset.y.toString() + "px";
            }

            this._draggingCurrentPoint.x = evX;
            this._draggingCurrentPoint.y = evY;

            console.log("this._draggingCurrentPoint.x = ", this._draggingCurrentPoint.x);
            console.log("this._draggingCurrentPoint.y = ", this._draggingCurrentPoint.y);
        }


        private onSplitterMouseUp = (ev: MouseEvent) => {
            //if (ev.target == this._visual) {
                this.moveGhost(ev);
                this.dragSplitter(this._draggingCurrentPoint.x, this._draggingCurrentPoint.y);
            //}
            document.removeEventListener("mousemove", this.onSplitterMouseMove, false);
            document.removeEventListener("mouseup", this.onSplitterMouseUp, false);
            ev.stopPropagation();
        }

        private dragSplitter(evX: number, evY: number) {
            var parentGrid = <Grid>this.parent;
            if (parentGrid == null)
                return;

            var saveDraggingStartPoint = true;

            if (this.verticalAlignment == VerticalAlignment.Top ||
                this.verticalAlignment == VerticalAlignment.Bottom) {
                var thisRowIndex = Grid.getRow(this);
                thisRowIndex = Math.min(thisRowIndex, parentGrid.rows.count - 1);

                var topRow: GridRow = parentGrid.rows.elements[this.verticalAlignment == VerticalAlignment.Top ? thisRowIndex - 1 : thisRowIndex];
                var bottomRow: GridRow = parentGrid.rows.elements[this.verticalAlignment == VerticalAlignment.Top ? thisRowIndex : thisRowIndex + 1];

                if (topRow.height.isAuto || bottomRow.height.isAuto)
                    return;

                if (topRow.height.isFixed || bottomRow.height.isFixed) {
                    var topRowWasStar = false;
                    var bottomRowWasStar = false;
                    if (topRow.height.isStar) {
                        var topRowHeight = parentGrid.getRowFinalHeight(this.verticalAlignment == VerticalAlignment.Top ? thisRowIndex - 1 : thisRowIndex);
                        topRow.height = new GridLength(topRowHeight, GridUnitType.Pixel);
                        topRowWasStar = true;
                    }
                    if (bottomRow.height.isStar) {
                        var bottomRowHeight = parentGrid.getRowFinalHeight(this.verticalAlignment == VerticalAlignment.Top ? thisRowIndex : thisRowIndex + 1);
                        bottomRow.height = new GridLength(bottomRowHeight, GridUnitType.Pixel);
                        bottomRowWasStar = true;
                    }

                    var maxTopRowHeight = topRow.height.value + bottomRow.height.value; //parentGrid.actualHeight - parentGridFixedRowsHeight;

                    var newTopRowHeight = topRow.height.value + (evY - this._draggingStartPoint.y);
                    var newBottomRowHeight = bottomRow.height.value - (evY - this._draggingStartPoint.y);

                    if (newTopRowHeight.isCloseTo(0))
                        newTopRowHeight = 0;
                    if (newTopRowHeight.isCloseTo(maxTopRowHeight))
                        newTopRowHeight = maxTopRowHeight;

                    if (newBottomRowHeight.isCloseTo(0))
                        newBottomRowHeight = 0;
                    if (newBottomRowHeight.isCloseTo(maxTopRowHeight))
                        newBottomRowHeight = maxTopRowHeight;

                    if (newTopRowHeight < 0) {
                        newTopRowHeight = 0;
                        newBottomRowHeight = maxTopRowHeight;
                        this._draggingStartPoint.y += - topRow.height.value;
                        saveDraggingStartPoint = false;
                    }
                    else if (newTopRowHeight > maxTopRowHeight) {
                        newTopRowHeight = maxTopRowHeight;
                        newBottomRowHeight = 0;
                        this._draggingStartPoint.y += - topRow.height.value + maxTopRowHeight;
                        saveDraggingStartPoint = false;
                    }

                    topRow.height = new GridLength(newTopRowHeight, GridUnitType.Pixel);
                    bottomRow.height = new GridLength(newBottomRowHeight, GridUnitType.Pixel);

                    if (bottomRowWasStar || topRowWasStar) {

                        var oldRowWithStarLen = bottomRowWasStar ? bottomRow : topRow;
                        var otherRow = bottomRowWasStar ? topRow : bottomRow;

                        var availTotalHeight = parentGrid.actualHeight;
                        parentGrid.rows.forEach((r, i) => {
                            if (r == otherRow)
                                availTotalHeight -= otherRow.height.value;
                            else if (!r.height.isStar && r != oldRowWithStarLen)
                                availTotalHeight -= parentGrid.getRowFinalHeight(i);
                        });

                        parentGrid.rows.forEach((r, i) => {
                            if (r.height.isStar)
                                r.height = new GridLength(parentGrid.getRowFinalHeight(i) / availTotalHeight, GridUnitType.Star);
                            else if (r == oldRowWithStarLen)
                                r.height = new GridLength(oldRowWithStarLen.height.value / availTotalHeight, GridUnitType.Star); 
                        });
                    }

                    //console.log("topRow=", topRow.height.value);
                    //console.log("bottomRow=", bottomRow.height.value);
                    //parentGrid.rows.forEach((r, i) => {
                    //    console.log("row=", i);
                    //    console.log("height=", r.height.value);
                    //});
                    //console.log("_draggingStartPointY=", this._draggingStartPointY);
                    //console.log("ev.y=", ev.y);
                                 
                    parentGrid.invalidateMeasure();
                    //LayoutManager.updateLayout();
                }
                else { //both are star

                    var sumFinalHeight = this.verticalAlignment == VerticalAlignment.Top ?
                        parentGrid.getRowFinalHeight(thisRowIndex - 1) + parentGrid.getRowFinalHeight(thisRowIndex) :
                        parentGrid.getRowFinalHeight(thisRowIndex) + parentGrid.getRowFinalHeight(thisRowIndex + 1);
                    var sumHeight = bottomRow.height.value + topRow.height.value;
                    var heightFactor = sumHeight / sumFinalHeight;
                    var heightStarDiff = (evY - this._draggingStartPoint.y) * heightFactor;

                    var newTopRowHeight = topRow.height.value + heightStarDiff;
                    var newBottomRowHeight = bottomRow.height.value - heightStarDiff;

                    if (newTopRowHeight.isCloseTo(0))
                        newTopRowHeight = 0;
                    if (newTopRowHeight.isCloseTo(sumHeight))
                        newTopRowHeight = sumHeight;

                    if (newBottomRowHeight.isCloseTo(sumHeight))
                        newBottomRowHeight = sumHeight;
                    if (newBottomRowHeight.isCloseTo(0))
                        newBottomRowHeight = 0;

                    if (newTopRowHeight < 0) {
                        heightStarDiff = -topRow.height.value;
                        this._draggingStartPoint.y = (heightStarDiff / heightFactor) + this._draggingStartPoint.y;
                    }
                    else if (newBottomRowHeight < 0) {
                        heightStarDiff = bottomRow.height.value;
                        this._draggingStartPoint.y = (heightStarDiff / heightFactor) + this._draggingStartPoint.y;
                    }

                    if (newTopRowHeight < 0 || newBottomRowHeight > sumHeight) {
                        newTopRowHeight = 0;
                        newBottomRowHeight = sumHeight;
                        saveDraggingStartPoint = false;
                    }
                    else if (newBottomRowHeight < 0 || newTopRowHeight > sumHeight) {
                        newTopRowHeight = sumHeight;
                        newBottomRowHeight = 0;
                        saveDraggingStartPoint = false;
                    }

                    topRow.height = new GridLength(newTopRowHeight, GridUnitType.Star);
                    bottomRow.height = new GridLength(newBottomRowHeight, GridUnitType.Star);
                    
                    //console.log("topRow=", topRow.height.value);
                    //console.log("bottomRow=", bottomRow.height.value);
                    //console.log("_draggingStartPointY=", this._draggingStartPointY);
                    //console.log("ev.y=", ev.y);

                    parentGrid.invalidateMeasure();
                    //LayoutManager.updateLayout();
                }
            }
            else if (this.horizontalAlignment == HorizontalAlignment.Left ||
                this.horizontalAlignment == HorizontalAlignment.Right) {
                var thisColumnIndex = Grid.getColumn(this);
                thisColumnIndex = Math.min(thisColumnIndex, parentGrid.columns.count - 1);

                var leftColumn: GridColumn = parentGrid.columns.elements[this.horizontalAlignment == HorizontalAlignment.Left ? thisColumnIndex - 1 : thisColumnIndex];
                var rightColumn: GridColumn = parentGrid.columns.elements[this.horizontalAlignment == HorizontalAlignment.Left ? thisColumnIndex : thisColumnIndex + 1];

                if (leftColumn.width.isAuto || rightColumn.width.isAuto)
                    return;

                if (leftColumn.width.isFixed || rightColumn.width.isFixed) {
                    var leftColumnWasStar = false;
                    var rightColumnWasStar = false;
                    if (leftColumn.width.isStar) {
                        var leftColumnWidth = parentGrid.getColumnFinalWidth(this.horizontalAlignment == HorizontalAlignment.Left ? thisColumnIndex - 1 : thisColumnIndex);
                        leftColumn.width = new GridLength(leftColumnWidth, GridUnitType.Pixel);
                        leftColumnWasStar = true;
                    }
                    if (rightColumn.width.isStar) {
                        var rightColumnWidth = parentGrid.getColumnFinalWidth(this.horizontalAlignment == HorizontalAlignment.Left ? thisColumnIndex : thisColumnIndex + 1);
                        rightColumn.width = new GridLength(rightColumnWidth, GridUnitType.Pixel);
                        rightColumnWasStar = true;
                    }

                    var maxBothColumnWidth = leftColumn.width.value + rightColumn.width.value;

                    var newLeftColumnWidth = leftColumn.width.value + (evX - this._draggingStartPoint.x);
                    var newRightColumnWidth = rightColumn.width.value - (evX - this._draggingStartPoint.x);

                    if (newLeftColumnWidth.isCloseTo(0))
                        newLeftColumnWidth = 0;
                    if (newLeftColumnWidth.isCloseTo(maxBothColumnWidth))
                        newLeftColumnWidth = maxBothColumnWidth;

                    if (newRightColumnWidth.isCloseTo(0))
                        newRightColumnWidth = 0;
                    if (newRightColumnWidth.isCloseTo(maxBothColumnWidth))
                        newRightColumnWidth = maxBothColumnWidth;

                    if (newLeftColumnWidth < 0) {
                        newLeftColumnWidth = 0;
                        newRightColumnWidth = maxBothColumnWidth;
                        this._draggingStartPoint.x += - leftColumn.width.value;
                        saveDraggingStartPoint = false;
                    }
                    else if (newLeftColumnWidth > maxBothColumnWidth) {
                        newLeftColumnWidth = maxBothColumnWidth;
                        newRightColumnWidth = 0;
                        this._draggingStartPoint.x += - leftColumn.width.value + maxBothColumnWidth;
                        saveDraggingStartPoint = false;
                    }

                    leftColumn.width = new GridLength(newLeftColumnWidth, GridUnitType.Pixel);
                    rightColumn.width = new GridLength(newRightColumnWidth, GridUnitType.Pixel);

                    if (rightColumnWasStar || leftColumnWasStar) {

                        var oldColumnWithStarLen = rightColumnWasStar ? rightColumn : leftColumn;
                        var otherColumn = rightColumnWasStar ? leftColumn : rightColumn;

                        var availTotalWidth = parentGrid.actualWidth;
                        parentGrid.columns.forEach((r, i) => {
                            if (r == otherColumn)
                                availTotalWidth -= otherColumn.width.value;
                            else if (!r.width.isStar && r != oldColumnWithStarLen)
                                availTotalWidth -= parentGrid.getColumnFinalWidth(i);
                        });

                        parentGrid.columns.forEach((r, i) => {
                            if (r.width.isStar)
                                r.width = new GridLength(parentGrid.getColumnFinalWidth(i) / availTotalWidth, GridUnitType.Star);
                            else if (r == oldColumnWithStarLen)
                                r.width = new GridLength(oldColumnWithStarLen.width.value / availTotalWidth, GridUnitType.Star);
                        });
                    }
                                 
                    parentGrid.invalidateMeasure();
                    LayoutManager.updateLayout();
                }
                else { //both are star

                    var sumFinalWidth = this.horizontalAlignment == HorizontalAlignment.Left ?
                        parentGrid.getColumnFinalWidth(thisColumnIndex - 1) + parentGrid.getColumnFinalWidth(thisColumnIndex) :
                        parentGrid.getColumnFinalWidth(thisColumnIndex) + parentGrid.getColumnFinalWidth(thisColumnIndex + 1);
                    var sumWidth = rightColumn.width.value + leftColumn.width.value;
                    var widthFactor = sumWidth / sumFinalWidth;
                    var widthStarDiff = (evX - this._draggingStartPoint.x) * widthFactor;

                    var newLeftColumnWidth = leftColumn.width.value + widthStarDiff;
                    var newRightColumnWidth = rightColumn.width.value - widthStarDiff;

                    if (newLeftColumnWidth.isCloseTo(0))
                        newLeftColumnWidth = 0;
                    if (newLeftColumnWidth.isCloseTo(sumWidth))
                        newLeftColumnWidth = sumWidth;

                    if (newRightColumnWidth.isCloseTo(sumWidth))
                        newRightColumnWidth = sumWidth;
                    if (newRightColumnWidth.isCloseTo(0))
                        newRightColumnWidth = 0;

                    if (newLeftColumnWidth < 0) {
                        widthStarDiff = -leftColumn.width.value;
                        this._draggingStartPoint.x = (widthStarDiff / widthFactor) + this._draggingStartPoint.x;
                    }
                    else if (newRightColumnWidth < 0) {
                        widthStarDiff = rightColumn.width.value;
                        this._draggingStartPoint.x = (widthStarDiff / widthFactor) + this._draggingStartPoint.x;
                    }

                    if (newLeftColumnWidth < 0 || newRightColumnWidth > sumWidth) {
                        newLeftColumnWidth = 0;
                        newRightColumnWidth = sumWidth;
                        saveDraggingStartPoint = false;
                    }
                    else if (newRightColumnWidth < 0 || newLeftColumnWidth > sumWidth) {
                        newLeftColumnWidth = sumWidth;
                        newRightColumnWidth = 0;
                        saveDraggingStartPoint = false;
                    }

                    leftColumn.width = new GridLength(newLeftColumnWidth, GridUnitType.Star);
                    rightColumn.width = new GridLength(newRightColumnWidth, GridUnitType.Star);

                    parentGrid.invalidateMeasure();
                    LayoutManager.updateLayout();
                }
            }


            if (saveDraggingStartPoint) {
                this._draggingStartPoint.x = evX;
                this._draggingStartPoint.y = evY;
            }
        }

    }
}