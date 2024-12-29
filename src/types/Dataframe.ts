export interface DataFrame {
    columns: string[];
    rows: DataRow[];
  }
  
  export interface DataRow {
    [key: string]: string | number; // Remove `boolean` type
  }
  