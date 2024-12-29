import { DataFrame as DanfoDataFrame } from 'danfojs';
import { DataFrame } from '../../types/Dataframe';

export const convertDanfoToCustomDataFrame = (danfoDf: DanfoDataFrame): DataFrame => {
  const columns = danfoDf.columns;
  const rows = (danfoDf.values as any[][]).map((row: any[]) => {
    const rowObject: { [key: string]: any } = {};
    columns.forEach((col, index) => {
      rowObject[col] = row[index];
    });
    return rowObject;
  });

  return { columns, rows };
}; 