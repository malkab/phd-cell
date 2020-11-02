/**
 *
 * Interface to describe a cell.
 *
 */
export interface ICell {

  gridId: string;
  epsg: string;
  zoom: number;
  x: number;
  y: number;
  data?: any;
  offset?: number;

}
