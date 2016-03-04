/// <reference path="..\DepProperty.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="Panel.ts" />

module layouts.controls {
    export class GridSplitter extends FrameworkElement {
        static typeName: string = "layouts.controls.GridSplitter";
        get typeName(): string {
            return GridSplitter.typeName;
        }

        protected _divElement: HTMLDivElement;
        
         
        attachVisualOverride(elementContainer: HTMLElement) {

            this._visual = this._divElement = document.createElement("div");
            this._visual.addEventListener("mousedown", (ev) => this.onSplitterMouseDown(ev), true);
            (<any>this._visual).tag = this;
            //this._visual.unselectable = "on";
            this._visual.onselectstart = function () { return false };
            //this._visual.style.use = element.style.MozUserSelect = "none";

            super.attachVisualOverride(elementContainer);
        }

        private onSplitterMouseDown(ev: MouseEvent) {
            var parentGrid = <Grid>this.parent;
            if (parentGrid != null)
                parentGrid.drag(this, ev);
        }


    }
}