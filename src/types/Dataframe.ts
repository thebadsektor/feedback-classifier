export interface DataFrame {
    columns: string[];
    rows: DataRow[];
  }
  
  export interface DataFrame {
    columns: string[];
    rows: DataRow[];
}

export interface DataRow {
    [key: string]: string | number | boolean; // Add `boolean` to match the actual data structure
}