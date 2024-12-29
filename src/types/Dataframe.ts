export interface DataFrame {
    columns: string[];
    rows: DataRow[];
}

export interface DataRow {
    [key: string]: any;
}