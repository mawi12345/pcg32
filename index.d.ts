export = PCG32;
export as namespace PCG32;

declare namespace PCG32 { }

declare class PCG32 {
    constructor(seed: number, stream?: number);

    /**
     * get a radnom number between 0 and bound (default 4294967295)
     */
    random(bound?: number): number;
}
