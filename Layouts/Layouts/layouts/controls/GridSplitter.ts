/// <reference path="..\DepProperty.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="Panel.ts" />

module layouts.controls {
    export class GridSplitter extends Border {
        static typeName: string = "layouts.controls.GridSplitter";
        get typeName(): string {
            return GridSplitter.typeName;
        }

        attachVisualOverride(elementContainer: HTMLElement) {
            super.attachVisualOverride(elementContainer);

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
        private _draggingStartPointX: number;
        private _draggingStartPointY: number;
        //private _draggingSplitter: GridSplitter;

        private initializeDrag(ev: MouseEvent) {
            var parentGrid = <Grid>this.parent;
            if (parentGrid == null)
                return;

            var dragging = false;

            if (this.verticalAlignment == VerticalAlignment.Top) {
                var thisRowIndex = Grid.getRow(this);
                thisRowIndex = Math.min(thisRowIndex, parentGrid.rows.count - 1);
                dragging = thisRowIndex > 0 && parentGrid.rows.count > 1;
            }
            else if (this.verticalAlignment == VerticalAlignment.Bottom) {
                var thisRowIndex = Grid.getRow(this);
                thisRowIndex = Math.min(thisRowIndex, parentGrid.rows.count - 1);
                dragging = thisRowIndex >= 0 && parentGrid.rows.count > 1;
            }
            else if (this.horizontalAlignment == HorizontalAlignment.Left) {
                var thisColIndex = Grid.getColumn(this);
                thisColIndex = Math.min(thisColIndex, parentGrid.columns.count - 1);
                dragging = thisColIndex > 0 && parentGrid.columns.count > 1;
            }
            else if (this.horizontalAlignment == HorizontalAlignment.Left) {
                var thisColIndex = Grid.getColumn(this);
                thisColIndex = Math.min(thisColIndex, parentGrid.columns.count - 1);
                dragging = thisColIndex >= 0 && parentGrid.columns.count > 1;
            }

            if (dragging) {
                document.addEventListener("mousemove", this.onSplitterMouseMove, false);
                document.addEventListener("mouseup", this.onSplitterMouseUp, false);
                this._draggingStartPointX = ev.x;
                this._draggingStartPointY = ev.y;
                //this._draggingSplitter = splitter;
                ev.stopPropagation();
            }
        }

        private onSplitterMouseMove = (ev: MouseEvent) => {
            this.dragSplitter(ev);
            if (ev.buttons == 0) {
                document.removeEventListener("mousemove", this.onSplitterMouseMove, false);
                document.removeEventListener("mouseup", this.onSplitterMouseUp, false);
            }
            ev.stopPropagation();
        }

        private onSplitterMouseUp = (ev: MouseEvent) => {
            this.dragSplitter(ev);
            document.removeEventListener("mousemove", this.onSplitterMouseMove, false);
            document.removeEventListener("mouseup", this.onSplitterMouseUp, false);
            ev.stopPropagation();
        }

        private dragSplitter(ev: MouseEvent) {
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
                    if (topRow.height.isFixed) {
                        var parentGridFixedRowsHeight = 0;
                        parentGrid.rows.elements.forEach((v, rowIndex) => {
                            if (rowIndex == thisRowIndex - 1)
                                return;
                            if (v.height.isFixed)
                                parentGridFixedRowsHeight += v.height.value;
                            if (v.height.isAuto)
                                parentGridFixedRowsHeight += parentGrid.getRowFinalHeight(rowIndex);
                        });
                        var maxTopRowHeight = parentGrid.actualHeight - parentGridFixedRowsHeight;
                        //console.log("parentGridFixedRowsHeight=", parentGridFixedRowsHeight);
                        //console.log("maxTopRowHeight=", maxTopRowHeight);

                        var newTopRowHeight = topRow.height.value + (ev.y - this._draggingStartPointY);

                        if (newTopRowHeight.isCloseTo(0))
                            newTopRowHeight = 0;
                        if (newTopRowHeight.isCloseTo(maxTopRowHeight))
                            newTopRowHeight = maxTopRowHeight;
                        
                        if (newTopRowHeight < 0) {
                            newTopRowHeight = 0;
                            this._draggingStartPointY = this._draggingStartPointY - topRow.height.value;
                            saveDraggingStartPoint = false;
                        }
                        else if (newTopRowHeight > maxTopRowHeight) {
                            newTopRowHeight = maxTopRowHeight;
                            this._draggingStartPointY = this._draggingStartPointY + maxTopRowHeight - topRow.height.value;
                            saveDraggingStartPoint = false;
                        }
                        
                        topRow.height = new GridLength(newTopRowHeight, GridUnitType.Pixel);
                    }
                    if (bottomRow.height.isFixed) {
                        var parentGridFixedRowsHeight = 0;
                        parentGrid.rows.elements.forEach((v, rowIndex) => {
                            if (rowIndex == thisRowIndex)
                                return;
                            if (v.height.isFixed)
                                parentGridFixedRowsHeight += v.height.value;
                            if (v.height.isAuto)
                                parentGridFixedRowsHeight += parentGrid.getRowFinalHeight(rowIndex);
                        });
                        var maxBottomRowHeight = parentGrid.actualHeight - parentGridFixedRowsHeight;
                        var newBottomRowHeight = bottomRow.height.value - (ev.y - this._draggingStartPointY);

                        if (newBottomRowHeight.isCloseTo(0))
                            newBottomRowHeight = 0;
                        if (newBottomRowHeight.isCloseTo(maxTopRowHeight))
                            newBottomRowHeight = maxTopRowHeight;

                        if (newBottomRowHeight < 0) {
                            newBottomRowHeight = 0;
                            this._draggingStartPointY = this._draggingStartPointY + bottomRow.height.value;
                            saveDraggingStartPoint = false;
                        }
                        else if (newBottomRowHeight > maxBottomRowHeight) {
                            newBottomRowHeight = maxBottomRowHeight;
                            this._draggingStartPointY = this._draggingStartPointY - maxBottomRowHeight + bottomRow.height.value;
                            saveDraggingStartPoint = false;
                        }

                        bottomRow.height = new GridLength(newBottomRowHeight, GridUnitType.Pixel);
                    }

                    //console.log("topRow=", topRow.height.value);
                    //console.log("bottomRow=", bottomRow.height.value);
                    //console.log("_draggingStartPointY=", this._draggingStartPointY);
                    //console.log("ev.y=", ev.y);
                                 
                    this.invalidateMeasure();
                }
                else { //both are star

                    var sumFinalHeight = parentGrid.getRowFinalHeight(thisRowIndex - 1) + parentGrid.getRowFinalHeight(thisRowIndex);
                    var sumHeight = bottomRow.height.value + topRow.height.value;
                    var heightFactor = sumHeight / sumFinalHeight;
                    var heightStarDiff = (ev.y - this._draggingStartPointY) * heightFactor;

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
                        this._draggingStartPointY = (heightStarDiff / heightFactor) + this._draggingStartPointY;
                    }
                    else if (newBottomRowHeight < 0) {
                        heightStarDiff = bottomRow.height.value;
                        this._draggingStartPointY = (heightStarDiff / heightFactor) + this._draggingStartPointY;
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

                    this.invalidateMeasure();
                }
            }

            if (saveDraggingStartPoint) {
                this._draggingStartPointX = ev.x;
                this._draggingStartPointY = ev.y;
            }
        }

    }
}