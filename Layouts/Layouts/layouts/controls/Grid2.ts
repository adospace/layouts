/// <reference path="..\DepProperty.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\IComparer.ts" /> 
/// <reference path="Panel.ts" />

//module layouts.controls {
//    enum Flags {
//        //
//        //  the foolowing flags let grid tracking dirtiness in more granular manner:
//        //  * Valid???Structure flags indicate that elements were added or removed.
//        //  * Valid???Layout flags indicate that layout time portion of the information
//        //    stored on the objects should be updated.
//        //
//        ValidDefinitionsUStructure = 0x00000001,
//        ValidDefinitionsVStructure = 0x00000002,
//        ValidCellsStructure = 0x00000004,
 
//        //
//        //  boolean properties state
//        //
//        ShowGridLinesPropertyValue = 0x00000100,   //  show grid lines ?
 
//        //
//        //  boolean flags
//        //
//        ListenToNotifications = 0x00001000,   //  "0" when all notifications are ignored
//        SizeToContentU = 0x00002000,   //  "1" if calculating to content in U direction
//        SizeToContentV = 0x00004000,   //  "1" if calculating to content in V direction
//        HasStarCellsU = 0x00008000,   //  "1" if at least one cell belongs to a Star column
//        HasStarCellsV = 0x00010000,   //  "1" if at least one cell belongs to a Star row
//        HasGroup3CellsInAutoRows = 0x00020000,   //  "1" if at least one cell of group 3 belongs to an Auto row
//        MeasureOverrideInProgress = 0x00040000,   //  "1" while in the context of Grid.MeasureOverride
//        ArrangeOverrideInProgress = 0x00080000,   //  "1" while in the context of Grid.ArrangeOverride
//    }

//    class BaseDefinition {

//    }

//    class ColumnDefinition extends BaseDefinition {

//    }

//    class RowDefinition extends BaseDefinition {

//    }

//    class ExtendedData {

//    }



//    export class Grid {
//        static typeName: string = "layouts.controls.Grid";
//        get typeName(): string {
//            return Grid.typeName;
//        }

//        //private consts
//        private static c_epsilon: number = 1e-5;                  //  used in fp calculations
//        private c_starClip: number = 1e298;                //  used as maximum for clipping star values during normalization
//        private c_layoutLoopMaxCount: number = 5;             // 5 is an arbitrary constant chosen to end the measure loop
        
//        //private fields
//        private _data: ExtendedData;
//        private _flags: Flags;
//        private _definitionIndices: number[];
//        private _roundingErrors: number[];

//        ///private methods
//        private setFlags(value: boolean, flags: Flags) {
//            this._flags = value ? (this._flags | flags) : (this._flags & (~flags));
//        }

//        private checkFlagsAnd(flags: Flags): boolean {
//            return ((this._flags & flags) == flags);
//        }

//        private checkFlagsOr(flags: Flags): boolean {
//            return (flags == 0 || (this._flags & flags) != 0);
//        }
 
//        private static compareNullRefs(x: Object, y: Object): { success: boolean, result: number } {
//            var result = 2;

//            if (x == null) {
//                if (y == null) {
//                    result = 0;
//                }
//                else {
//                    result = -1;
//                }
//            }
//            else {
//                if (y == null) {
//                    result = 1;
//                }
//            }

//            return { success: (result != 2), result };
//        }


//        //Internal Properties
//        get measureOverrideInProgress(): boolean {
//            return this.checkFlagsAnd(Flags.MeasureOverrideInProgress);
//        }
//        set measureOverrideInProgress(value: boolean) {
//            this.setFlags(value, Flags.MeasureOverrideInProgress);
//        }

//        get arrangeOverrideInProgress(): boolean {
//            return this.checkFlagsAnd(Flags.ArrangeOverrideInProgress);
//        }
//        set arrangeOverrideInProgress(value: boolean) {
//            this.setFlags(value, Flags.ArrangeOverrideInProgress);
//        }

//        get columnDefinitionCollectionDirty(): boolean {
//            return this.checkFlagsAnd(Flags.ValidDefinitionsUStructure);
//        }
//        set columnDefinitionCollectionDirty(value: boolean) {
//            this.setFlags(value, Flags.ValidDefinitionsUStructure);
//        }

//        get rowDefinitionCollectionDirty(): boolean {
//            return this.checkFlagsAnd(Flags.ValidDefinitionsVStructure);
//        }
//        set rowDefinitionCollectionDirty(value: boolean) {
//            this.setFlags(value, Flags.ValidDefinitionsVStructure);
//        }

//        //private properties
//        private get cellsStructureDirty(): boolean {
//            return this.checkFlagsAnd(Flags.ValidCellsStructure);
//        }
//        private set cellsStructureDirty(value: boolean) {
//            this.setFlags(value, Flags.ValidCellsStructure);
//        }

//        private get listenToNotifications(): boolean {
//            return this.checkFlagsAnd(Flags.ListenToNotifications);
//        }
//        private set listenToNotifications(value: boolean) {
//            this.setFlags(value, Flags.ListenToNotifications);
//        }

//        private get sizeToContentU(): boolean {
//            return this.checkFlagsAnd(Flags.SizeToContentU);
//        }
//        private set sizeToContentU(value: boolean) {
//            this.setFlags(value, Flags.SizeToContentU);
//        }

//        private get sizeToContentV(): boolean {
//            return this.checkFlagsAnd(Flags.SizeToContentV);
//        }
//        private set sizeToContentV(value: boolean) {
//            this.setFlags(value, Flags.SizeToContentV);
//        }

//        private get hasStarCellsU(): boolean {
//            return this.checkFlagsAnd(Flags.HasStarCellsU);
//        }
//        private set hasStarCellsU(value: boolean) {
//            this.setFlags(value, Flags.HasStarCellsU);
//        }

//        private get hasStarCellsV(): boolean {
//            return this.checkFlagsAnd(Flags.HasStarCellsV);
//        }
//        private set hasStarCellsV(value: boolean) {
//            this.setFlags(value, Flags.HasStarCellsV);
//        }

//        private get hasGroup3CellsInAutoRows(): boolean {
//            return this.checkFlagsAnd(Flags.HasGroup3CellsInAutoRows);
//        }
//        private set hasGroup3CellsInAutoRows(value: boolean) {
//            this.setFlags(value, Flags.HasGroup3CellsInAutoRows);
//        }

//        private static _IsZero(d: number): boolean {
//            return (Math.abs(d) < Grid.c_epsilon);
//        }
 
//        private static _AreClose(d1: number, d2: number): boolean {
//            return (Math.abs(d1 - d2) < Grid.c_epsilon);
//        }

//        private get ExtData(): ExtendedData {
//            return (this._data);
//        }

//    }
//} 