/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 

module layouts.controls {
    export class ItemsControl extends FrameworkElement implements ISupportCollectionChanged {
        static typeName: string = "layouts.controls.ItemsControl";
        get typeName(): string {
            return ItemsControl.typeName;
        }

        private static _init = ItemsControl.initProperties();
        private static initProperties() {
            //FrameworkElement.overflowXProperty.overrideDefaultValue(ItemsControl.typeName, "auto");
            FrameworkElement.overflowYProperty.overrideDefaultValue(ItemsControl.typeName, "auto");
        }

        //list of items created
        //note that in general this list is not 1:1 with itemssource collection
        //for example the case when some sort of virtualization of items is applied
        protected _elements: Array<UIElement> = null;

        protected _divElement: HTMLDivElement;
        attachVisualOverride(elementContainer: HTMLElement) {

            this._visual = this._divElement = document.createElement("div");

            let itemsPanel = this.itemsPanel;
            if (itemsPanel == null)
                this.itemsPanel = itemsPanel = new Stack();

            itemsPanel.attachVisual(this._visual);

            super.attachVisualOverride(elementContainer);
        }

        protected measureOverride(constraint: Size): Size {

            if (this.itemsPanel != null) {
                this.itemsPanel.measure(constraint);
                return this.itemsPanel.desiredSize;
            }

            return new Size();
        }

        protected arrangeOverride(finalSize: Size): Size {
            if (this.itemsPanel != null)
                this.itemsPanel.arrange(finalSize.toRect());

            return finalSize;
        }

        protected layoutOverride() {
            super.layoutOverride();
            if (this.itemsPanel != null)
                this.itemsPanel.layout();
        }

        //Templates collection
        private _templates: ObservableCollection<DataTemplate>;
        get templates(): ObservableCollection<DataTemplate> {
            return this._templates;
        }
        set templates(value: ObservableCollection<DataTemplate>) {
            if (value == this._templates)
                return;

            if (this._templates != null) {
                //remove handler so that resource can be disposed
                this._templates.offChangeNotify(this);
            }

            this._templates = value;
  
            if (this._templates != null) {
                this._templates.forEach(el=> {
                    //to do: re-apply templates to children
                });

                this._templates.onChangeNotify(this);
            }
        }

        onCollectionChanged(collection: any, added: Object[], removed: Object[], startRemoveIndex: number) {

            if (collection == this._templates) {
                //templates collection is changed
                this.setupItems();
            }
            else if (collection == this.itemsSource) {
                //some items were added/removed from itemssouurce

                if (this.itemsPanel == null)
                    return;

                added.forEach(item=> {
                    if (item == null)
                        throw new Error("Unable to render null items");

                    var templateForItem = DataTemplate.getTemplateForItem(this._templates.toArray(), item);
                    if (templateForItem == null) {
                        throw new Error("Unable to find a valid template for item");
                    }

                    var newElement = templateForItem.createElement();
                    newElement.setValue(FrameworkElement.dataContextProperty, item);
                    this.itemsPanel.children.add(newElement);
                });

                removed.forEach(item=> {
                    this.itemsPanel.children.remove(
                        this.itemsPanel.children.at(startRemoveIndex++));
                });

            }

            this.invalidateMeasure();
        }

        //itemsSource property
        static itemsSourceProperty = DepObject.registerProperty(ItemsControl.typeName, "ItemsSource", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get itemsSource(): any {
            return <any>this.getValue(ItemsControl.itemsSourceProperty);
        }
        set itemsSource(value: any) {
            this.setValue(ItemsControl.itemsSourceProperty, value);
        }

        //itemsPanel property
        static itemsPanelProperty = DepObject.registerProperty(ItemsControl.typeName, "ItemsPanel", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get itemsPanel(): Panel {
            return <Panel>this.getValue(ItemsControl.itemsPanelProperty);
        }
        set itemsPanel(value: Panel) {
            this.setValue(ItemsControl.itemsPanelProperty, value);
        }

        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            if (property == ItemsControl.itemsSourceProperty) {
                if (oldValue != null && oldValue["offChangeNotify"] != null) {
                    var oldItmesSource = <ObservableCollection<Object>>oldValue;
                    oldItmesSource.offChangeNotify(this);
                }

                this.setupItems();

                if (value != null && value["onChangeNotify"] != null) {
                    var newItemsSource = <ObservableCollection<Object>>value;
                    newItemsSource.onChangeNotify(this);
                }
            }
            else if (property == ItemsControl.itemsPanelProperty) {
                var oldPanel = (<Panel>oldValue);
                if (oldPanel != null && oldPanel.parent == this) {
                    oldPanel.children = null;
                    oldPanel.parent = null;
                    oldPanel.attachVisual(null);
                }

                var newPanel = (<Panel>value);
                if (newPanel != null) {
                    newPanel.parent = this;
                    if (this._visual != null)
                        newPanel.attachVisual(this._visual);
                }

            }
            else if (property == ItemsControl.itemsPanelProperty)
                this.setupItems();

            super.onDependencyPropertyChanged(property, value, oldValue);
        }

        //private getTemplateForItem(item: any): DataTemplate {
        //    if (this._templates == null ||
        //        this._templates.count == 0)
        //        return null;

        //    var typeName: string = typeof item;
        //    if (Ext.hasProperty(item, "typeName"))
        //        typeName = item["typeName"];
        //    else {
        //        if (item instanceof Date)//detect date type
        //            typeName = "date";
                    
        //    }

        //    var foundTemplate: DataTemplate = null;

        //    if (typeName != null)
        //        foundTemplate = Enumerable.From(this.templates.elements).FirstOrDefault(null, dt => dt.targetType != null && dt.targetType.toLowerCase() == typeName.toLowerCase());

        //    if (foundTemplate != null)
        //        return foundTemplate;

        //    return Enumerable.From(this.templates.elements).FirstOrDefault(null, dt => dt.targetType == null);
        //}

        private setupItems() {
            
            if (this._elements != null) {
                this.itemsPanel.children = null;
                this._elements = null;
            }            

            if (this._templates == null ||
                this._templates.count == 0)
                return;

            var itemsSource = this.itemsSource;
            if (itemsSource != null) {

                var elements : any[] = null;
                if (Object.prototype.toString.call(itemsSource) == '[object Array]')
                    elements = <any[]>itemsSource;
                else
                    elements = <any[]>itemsSource["elements"];

                if (elements == null)
                    throw new Error("Unable to get list of elements from itemsSource");

                this._elements =
                Enumerable.From(elements).Select(item=> {

                    var templateForItem = DataTemplate.getTemplateForItem(this._templates.toArray(), item);
                    if (templateForItem == null) {
                        throw new Error("Unable to find a valid template for item");
                    }

                    var newElement = templateForItem.createElement();
                    newElement.setValue(FrameworkElement.dataContextProperty, item);
                    return newElement;
                }).ToArray();
            }


            if (this._elements != null) {
                if (this.itemsPanel == null) {
                    this.itemsPanel = new Stack();
                    this.itemsPanel.parent = this;
                    if (this._visual != null)
                        this.itemsPanel.attachVisual(this._visual);
                }

                this.itemsPanel.children = new ObservableCollection<UIElement>(this._elements);
            }            

            this.invalidateMeasure();
        }

    }
}