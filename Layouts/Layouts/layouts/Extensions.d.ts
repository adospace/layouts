interface String {
    format(...replacements: string[]): string;
}
interface Object {
    getTypeName(): string;
}
interface Number {
    isEpsilon(): boolean;
    isCloseTo(other: number): boolean;
    minMax(min: number, max: number): any;
}
declare class InstanceLoader {
    private context;
    constructor(context: Object);
    getInstance(name: string, ...args: any[]): any;
}
