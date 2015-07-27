/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 

module layouts.controls {
    export class ItemsControl extends FrameworkElement {
        static typeName: string = "layouts.controls.ItemsControl";
        get typeName(): string {
            return ItemsControl.typeName;
        }

        //list of items created
        //note that in general this list is not 1:1 with itemssource collection
        //for example the case when some sort of virtualization of items is applied
        protected _elements: Array<UIElement> = new Array<UIElement>();

        protected _divElement: HTMLDivElement;
        attachVisualOverride(elementContainer: HTMLElement) {

            this._visual = this._divElement = document.createElement("div");

            let itemsPanel = this.itemsPanel;
            if (itemsPanel == null)
                this.itemsPanel = itemsPanel = new Stack();


            itemsPanel.attachVisual(this._divElement);
            
            super.attachVisualOverride(elementContainer);
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
                this._templates.off(this.templateCollectionChanged);
            }

            this._templates = value;
            //attach new children here
            this._templates.forEach(el=> {

            });

            this._templates.on(this.templateCollectionChanged);
        }
        private templateCollectionChanged(collection: ObservableCollection<DataTemplate>, added: DataTemplate[], removed: DataTemplate[]) {
            removed.forEach(el=> {

            });
            added.forEach(el=> {

            });

            this.invalidateMeasure();
        }

        //itemsSource property
        static itemsSourceProperty = DepObject.registerProperty(ItemsControl.typeName, "ItemsSource", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get itemsSource(): ObservableCollection<Object> {
            return <ObservableCollection<Object>>this.getValue(ItemsControl.itemsSourceProperty);
        }
        set itemsSource(value: ObservableCollection<Object>) {
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


        protected onPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            if (property == ItemsControl.itemsSourceProperty) {
                if (oldValue != null) {

                }

                this.setupItems();

                if (value != null) {

                }
            }

            super.onPropertyChanged(property, value, oldValue);
        }

        private getTemplateForItem(item: any): DataTemplate {
            if (this._templates == null ||
                this._templates.count == 0)
                return null;

            let typeName: string = null
            if (item.hasProperty("typeName"))
                typeName = item["typeName"];

            let defaultTemplate = Enumerable.From(this.templates.elements).FirstOrDefault(null, dt => dt.targetType == null);
            if (typeName != null)
                return Enumerable.From(this.templates.elements).FirstOrDefault(defaultTemplate, dt => dt.targetType == typeName);

            return defaultTemplate;                      
        }

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
                this._elements =
                Enumerable.From(itemsSource.elements).Select(item=> {

                    var templateForItem = this.getTemplateForItem(item);
                    if (templateForItem == null) {
                        throw new Error("Unable to find a valid template for item");
                    }

                    var newElement = <UIElement>templateForItem.child.clone();
                    newElement.setValue(FrameworkElement.dataContextProperty, item);
                    return newElement;
                }).ToArray();
            }


            if (this._elements != null) {
                this.itemsPanel.children = new ObservableCollection<UIElement>(this._elements);
            }            

        }


    }
}