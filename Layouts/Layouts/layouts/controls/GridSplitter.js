var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var GridSplitter = (function (_super) {
            __extends(GridSplitter, _super);
            function GridSplitter() {
                var _this = _super.call(this) || this;
                _this._draggingCurrentPoint = new layouts.Vector();
                _this._draggingStartPoint = new layouts.Vector();
                _this._draggingVirtualOffset = new layouts.Vector();
                _this._draggingVirtualOffsetMin = new layouts.Vector();
                _this._draggingVirtualOffsetMax = new layouts.Vector();
                _this.onSplitterMouseMove = function (ev) {
                    if (ev.buttons == 0) {
                        document.removeEventListener("mousemove", _this.onSplitterMouseMove, false);
                        document.removeEventListener("mouseup", _this.onSplitterMouseUp, false);
                    }
                    else
                        _this.moveGhost(ev);
                    ev.stopPropagation();
                };
                _this.onSplitterMouseUp = function (ev) {
                    _this.moveGhost(ev);
                    _this.dragSplitter(_this._draggingCurrentPoint.x, _this._draggingCurrentPoint.y);
                    document.removeEventListener("mousemove", _this.onSplitterMouseMove, false);
                    document.removeEventListener("mouseup", _this.onSplitterMouseUp, false);
                    ev.stopPropagation();
                };
                layouts.FrameworkElement.classProperty.overrideDefaultValue(GridSplitter.typeName, "gridSplitter");
                return _this;
            }
            Object.defineProperty(GridSplitter.prototype, "typeName", {
                get: function () {
                    return GridSplitter.typeName;
                },
                enumerable: true,
                configurable: true
            });
            GridSplitter.prototype.attachVisualOverride = function (elementContainer) {
                var _this = this;
                _super.prototype.attachVisualOverride.call(this, elementContainer);
                this._visual.addEventListener("mousedown", function (ev) { return _this.onSplitterMouseDown(ev); }, true);
                this._visual.tag = this;
                this._visual.onselectstart = function () { return false; };
                this.updateCursor();
            };
            GridSplitter.prototype.onSplitterMouseDown = function (ev) {
                this.initializeDrag(ev);
            };
            GridSplitter.prototype.updateCursor = function () {
                if (this._visual == null) {
                    this._visual.style.cursor = "normal";
                    return;
                }
                if (this.verticalAlignment == layouts.VerticalAlignment.Top ||
                    this.verticalAlignment == layouts.VerticalAlignment.Bottom)
                    this._visual.style.cursor = "n-resize";
                else if (this.horizontalAlignment == layouts.HorizontalAlignment.Left ||
                    this.horizontalAlignment == layouts.HorizontalAlignment.Right)
                    this._visual.style.cursor = "e-resize";
                else
                    this._visual.style.cursor = layouts.Consts.stringEmpty;
            };
            GridSplitter.prototype.initializeDrag = function (ev) {
                var parentGrid = this.parent;
                if (parentGrid == null)
                    return;
                if (this.visualOffset == null)
                    return;
                var dragging = false;
                var leftColumnWidth = 0;
                var rightColumnWidth = 0;
                var topRowHeight = 0;
                var bottomRowHeight = 0;
                if (this.verticalAlignment == layouts.VerticalAlignment.Top) {
                    var thisRowIndex = controls.Grid.getRow(this);
                    thisRowIndex = Math.min(thisRowIndex, parentGrid.rows.count - 1);
                    dragging = thisRowIndex > 0 && parentGrid.rows.count > 1;
                    if (dragging) {
                        topRowHeight = parentGrid.getRowFinalHeight(thisRowIndex - 1) - parentGrid.getRows().at(thisRowIndex - 1).minHeight;
                        bottomRowHeight = parentGrid.getRowFinalHeight(thisRowIndex) - parentGrid.getRows().at(thisRowIndex).minHeight;
                    }
                }
                else if (this.verticalAlignment == layouts.VerticalAlignment.Bottom) {
                    var thisRowIndex = controls.Grid.getRow(this);
                    thisRowIndex = Math.min(thisRowIndex, parentGrid.rows.count - 1);
                    dragging = thisRowIndex >= 0 && parentGrid.rows.count > 1;
                    if (dragging) {
                        topRowHeight = parentGrid.getRowFinalHeight(thisRowIndex) - parentGrid.getRows().at(thisRowIndex).minHeight;
                        bottomRowHeight = parentGrid.getRowFinalHeight(thisRowIndex + 1) - parentGrid.getRows().at(thisRowIndex + 1).minHeight;
                    }
                }
                else if (this.horizontalAlignment == layouts.HorizontalAlignment.Left) {
                    var thisColIndex = controls.Grid.getColumn(this);
                    thisColIndex = Math.min(thisColIndex, parentGrid.columns.count - 1);
                    dragging = thisColIndex > 0 && parentGrid.columns.count > 1;
                    if (dragging) {
                        leftColumnWidth = parentGrid.getColumnFinalWidth(thisColIndex - 1) - parentGrid.getColumns().at(thisColIndex - 1).minWidth;
                        rightColumnWidth = parentGrid.getColumnFinalWidth(thisColIndex) - parentGrid.getColumns().at(thisColIndex).minWidth;
                    }
                }
                else if (this.horizontalAlignment == layouts.HorizontalAlignment.Right) {
                    var thisColIndex = controls.Grid.getColumn(this);
                    thisColIndex = Math.min(thisColIndex, parentGrid.columns.count - 1);
                    dragging = thisColIndex >= 0 && parentGrid.columns.count > 1;
                    if (dragging) {
                        leftColumnWidth = parentGrid.getColumnFinalWidth(thisColIndex) - parentGrid.getColumns().at(thisColIndex).minWidth;
                        rightColumnWidth = parentGrid.getColumnFinalWidth(thisColIndex + 1) - parentGrid.getColumns().at(thisColIndex + 1).minWidth;
                    }
                }
                if (dragging) {
                    document.addEventListener("mousemove", this.onSplitterMouseMove, false);
                    document.addEventListener("mouseup", this.onSplitterMouseUp, false);
                    this._draggingStartPoint.x = this._draggingCurrentPoint.x = ev.x;
                    this._draggingStartPoint.y = this._draggingCurrentPoint.y = ev.y;
                    this._draggingVirtualOffset.x = this.visualOffset.x;
                    this._draggingVirtualOffset.y = this.visualOffset.y;
                    if (this.horizontalAlignment == layouts.HorizontalAlignment.Left ||
                        this.horizontalAlignment == layouts.HorizontalAlignment.Right) {
                        this._draggingVirtualOffsetMin.x = this.visualOffset.x - leftColumnWidth;
                        this._draggingVirtualOffsetMax.x = this.visualOffset.x + rightColumnWidth;
                    }
                    else {
                        this._draggingVirtualOffsetMin.y = this.visualOffset.y - topRowHeight;
                        this._draggingVirtualOffsetMax.y = this.visualOffset.y + bottomRowHeight;
                    }
                    ev.stopPropagation();
                }
            };
            GridSplitter.prototype.moveGhost = function (ev) {
                var evX = ev.x;
                var evY = ev.y;
                if (this.horizontalAlignment == layouts.HorizontalAlignment.Right ||
                    this.horizontalAlignment == layouts.HorizontalAlignment.Left) {
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
            };
            GridSplitter.prototype.dragSplitter = function (evX, evY) {
                var parentGrid = this.parent;
                if (parentGrid == null)
                    return;
                var saveDraggingStartPoint = true;
                if (this.verticalAlignment == layouts.VerticalAlignment.Top ||
                    this.verticalAlignment == layouts.VerticalAlignment.Bottom) {
                    var thisRowIndex = controls.Grid.getRow(this);
                    thisRowIndex = Math.min(thisRowIndex, parentGrid.rows.count - 1);
                    var topRow = parentGrid.rows.elements[this.verticalAlignment == layouts.VerticalAlignment.Top ? thisRowIndex - 1 : thisRowIndex];
                    var bottomRow = parentGrid.rows.elements[this.verticalAlignment == layouts.VerticalAlignment.Top ? thisRowIndex : thisRowIndex + 1];
                    if (topRow.height.isAuto || bottomRow.height.isAuto)
                        return;
                    if (topRow.height.isFixed || bottomRow.height.isFixed) {
                        var topRowWasStar = false;
                        var bottomRowWasStar = false;
                        if (topRow.height.isStar) {
                            var topRowHeight = parentGrid.getRowFinalHeight(this.verticalAlignment == layouts.VerticalAlignment.Top ? thisRowIndex - 1 : thisRowIndex);
                            topRow.height = new controls.GridLength(topRowHeight, controls.GridUnitType.Pixel);
                            topRowWasStar = true;
                        }
                        if (bottomRow.height.isStar) {
                            var bottomRowHeight = parentGrid.getRowFinalHeight(this.verticalAlignment == layouts.VerticalAlignment.Top ? thisRowIndex : thisRowIndex + 1);
                            bottomRow.height = new controls.GridLength(bottomRowHeight, controls.GridUnitType.Pixel);
                            bottomRowWasStar = true;
                        }
                        var maxTopRowHeight = topRow.height.value + bottomRow.height.value;
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
                            this._draggingStartPoint.y += -topRow.height.value;
                            saveDraggingStartPoint = false;
                        }
                        else if (newTopRowHeight > maxTopRowHeight) {
                            newTopRowHeight = maxTopRowHeight;
                            newBottomRowHeight = 0;
                            this._draggingStartPoint.y += -topRow.height.value + maxTopRowHeight;
                            saveDraggingStartPoint = false;
                        }
                        topRow.height = new controls.GridLength(newTopRowHeight, controls.GridUnitType.Pixel);
                        bottomRow.height = new controls.GridLength(newBottomRowHeight, controls.GridUnitType.Pixel);
                        if (bottomRowWasStar || topRowWasStar) {
                            var oldRowWithStarLen = bottomRowWasStar ? bottomRow : topRow;
                            var otherRow = bottomRowWasStar ? topRow : bottomRow;
                            var availTotalHeight = parentGrid.actualHeight;
                            parentGrid.rows.forEach(function (r, i) {
                                if (r == otherRow)
                                    availTotalHeight -= otherRow.height.value;
                                else if (!r.height.isStar && r != oldRowWithStarLen)
                                    availTotalHeight -= parentGrid.getRowFinalHeight(i);
                            });
                            parentGrid.rows.forEach(function (r, i) {
                                if (r.height.isStar)
                                    r.height = new controls.GridLength(parentGrid.getRowFinalHeight(i) / availTotalHeight, controls.GridUnitType.Star);
                                else if (r == oldRowWithStarLen)
                                    r.height = new controls.GridLength(oldRowWithStarLen.height.value / availTotalHeight, controls.GridUnitType.Star);
                            });
                        }
                        parentGrid.invalidateMeasure();
                    }
                    else {
                        var sumFinalHeight = this.verticalAlignment == layouts.VerticalAlignment.Top ?
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
                        topRow.height = new controls.GridLength(newTopRowHeight, controls.GridUnitType.Star);
                        bottomRow.height = new controls.GridLength(newBottomRowHeight, controls.GridUnitType.Star);
                        parentGrid.invalidateMeasure();
                    }
                }
                else if (this.horizontalAlignment == layouts.HorizontalAlignment.Left ||
                    this.horizontalAlignment == layouts.HorizontalAlignment.Right) {
                    var thisColumnIndex = controls.Grid.getColumn(this);
                    thisColumnIndex = Math.min(thisColumnIndex, parentGrid.columns.count - 1);
                    var leftColumn = parentGrid.columns.elements[this.horizontalAlignment == layouts.HorizontalAlignment.Left ? thisColumnIndex - 1 : thisColumnIndex];
                    var rightColumn = parentGrid.columns.elements[this.horizontalAlignment == layouts.HorizontalAlignment.Left ? thisColumnIndex : thisColumnIndex + 1];
                    if (leftColumn.width.isAuto || rightColumn.width.isAuto)
                        return;
                    if (leftColumn.width.isFixed || rightColumn.width.isFixed) {
                        var leftColumnWasStar = false;
                        var rightColumnWasStar = false;
                        if (leftColumn.width.isStar) {
                            var leftColumnWidth = parentGrid.getColumnFinalWidth(this.horizontalAlignment == layouts.HorizontalAlignment.Left ? thisColumnIndex - 1 : thisColumnIndex);
                            leftColumn.width = new controls.GridLength(leftColumnWidth, controls.GridUnitType.Pixel);
                            leftColumnWasStar = true;
                        }
                        if (rightColumn.width.isStar) {
                            var rightColumnWidth = parentGrid.getColumnFinalWidth(this.horizontalAlignment == layouts.HorizontalAlignment.Left ? thisColumnIndex : thisColumnIndex + 1);
                            rightColumn.width = new controls.GridLength(rightColumnWidth, controls.GridUnitType.Pixel);
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
                            this._draggingStartPoint.x += -leftColumn.width.value;
                            saveDraggingStartPoint = false;
                        }
                        else if (newLeftColumnWidth > maxBothColumnWidth) {
                            newLeftColumnWidth = maxBothColumnWidth;
                            newRightColumnWidth = 0;
                            this._draggingStartPoint.x += -leftColumn.width.value + maxBothColumnWidth;
                            saveDraggingStartPoint = false;
                        }
                        leftColumn.width = new controls.GridLength(newLeftColumnWidth, controls.GridUnitType.Pixel);
                        rightColumn.width = new controls.GridLength(newRightColumnWidth, controls.GridUnitType.Pixel);
                        if (rightColumnWasStar || leftColumnWasStar) {
                            var oldColumnWithStarLen = rightColumnWasStar ? rightColumn : leftColumn;
                            var otherColumn = rightColumnWasStar ? leftColumn : rightColumn;
                            var availTotalWidth = parentGrid.actualWidth;
                            parentGrid.columns.forEach(function (r, i) {
                                if (r == otherColumn)
                                    availTotalWidth -= otherColumn.width.value;
                                else if (!r.width.isStar && r != oldColumnWithStarLen)
                                    availTotalWidth -= parentGrid.getColumnFinalWidth(i);
                            });
                            parentGrid.columns.forEach(function (r, i) {
                                if (r.width.isStar)
                                    r.width = new controls.GridLength(parentGrid.getColumnFinalWidth(i) / availTotalWidth, controls.GridUnitType.Star);
                                else if (r == oldColumnWithStarLen)
                                    r.width = new controls.GridLength(oldColumnWithStarLen.width.value / availTotalWidth, controls.GridUnitType.Star);
                            });
                        }
                        parentGrid.invalidateMeasure();
                        layouts.LayoutManager.updateLayout();
                    }
                    else {
                        var sumFinalWidth = this.horizontalAlignment == layouts.HorizontalAlignment.Left ?
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
                        leftColumn.width = new controls.GridLength(newLeftColumnWidth, controls.GridUnitType.Star);
                        rightColumn.width = new controls.GridLength(newRightColumnWidth, controls.GridUnitType.Star);
                        parentGrid.invalidateMeasure();
                        layouts.LayoutManager.updateLayout();
                    }
                }
                if (saveDraggingStartPoint) {
                    this._draggingStartPoint.x = evX;
                    this._draggingStartPoint.y = evY;
                }
            };
            return GridSplitter;
        }(controls.Border));
        GridSplitter.typeName = "layouts.controls.GridSplitter";
        controls.GridSplitter = GridSplitter;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
