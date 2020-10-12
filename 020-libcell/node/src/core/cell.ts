import { Grid } from "./grid";

import { Bbox, IBbox } from "./bbox";

import { Coordinate } from "./coordinate";

import proj4 from "proj4";

import * as turf from "@turf/turf";

import { Polygon } from "./polygon";

/**
 *
 *
 * This class represents a cell.
 *
 * Cells have an important member that is the **offset**, which defaults
 * to 0. When the offset is positive, it expands the cell outwards, when
 * it's negative, it shrinks the cell inwards.
 *
 */
export class Cell {

  /**
   *
   * The cell zoom, x, and y.
   *
   */
  private _zoom: number;
  private _x: number;
  private _y: number;

  /**
   *
   * The cell grid.
   *
   */
  private _grid: Grid;

  /**
   *
   * Cell data.
   *
   */
  private _data: any;

  /**
   *
   * Cell offset.
   *
   */
  private _offset: number;

  /**
   *
   * The x and y coordinate.
   *
   */
  get x(): number { return this._x; }

  get y(): number { return this._y; }

  /**
   *
   * The cell's grid.
   *
   */
  get grid(): Grid { return this._grid; }

  set grid(grid: Grid) { this._grid = grid; }

  /**
   *
   * The cell's zoom.
   *
   */
  get zoom(): number { return this._zoom; }

  /**
   *
   * Size of the side of the cell.
   *
   */
  get sideSize(): number { return +this.grid.zoomLevels[this.zoom].size; }

  /**
   *
   * Area of the cell.
   *
   */
  get area(): number { return this.sideSize * this.sideSize; }

  /**
   *
   * Lower left corner.
   *
   */
  get lowerLeft(): Coordinate {

    const ox: number = this._grid.origin.x;
    const oy: number = this._grid.origin.y;
    const s: number = this._grid.zoomLevels[this._zoom].size;

    return new Coordinate({
      epsg: this._grid.epsg,
      x: ox + (this._x * s) - this._offset,
      y: oy + (this._y * s) - this._offset
    });

  }

  /**
   *
   * Upper right corner.
   *
   */
  get upperRight(): Coordinate {

    const ox: number = this._grid.origin.x;
    const oy: number = this._grid.origin.y;
    const s: number = this._grid.zoomLevels[this._zoom].size;

    return new Coordinate({
      epsg: this._grid.epsg,
      x: ox + ((this._x + 1) * s) + this._offset,
      y: oy + ((this._y + 1) * s) + this._offset
    });

  }

  /**
   *
   * Returns the center of the cell as a Coordinate.
   *
   */
  get center(): Coordinate {

    return new Coordinate({
      epsg: this.grid.epsg,
      x: this.lowerLeft.x + (this.sideSize / 2),
      y: this.lowerLeft.y + (this.sideSize / 2)
    });

  }

  /**
   *
   * The cell's data.
   *
   */
  get data(): any { return this._data; }

  set data(data: any) { this._data = data; }

  /**
   *
   * Cell as string, for debugging.
   *
   */
  get asString(): string { return `${this._zoom}/${this._x}/${this._y}`; }

  /**
   *
   * The cell's offset
   *
   */
  set offset(offset: number) { this._offset = offset; }

  get offset(): number { return this._offset; }

  /**
   *
   * Gets a BBox object from this cell
   *
   */
  get bbox(): Bbox { return this._getBbox(); }

  /**
   *
   * Returns the EWKT representation of the cell
   *
   */
  get ewkt(): string {

    const ll: Coordinate = this.lowerLeft;
    const ur: Coordinate = this.upperRight;

    let ewkt: string = `SRID=${this._grid.epsg};`;

    ewkt += `POLYGON((${ll.x} ${ll.y},${ur.x} ${ll.y},${ur.x} ${ur.y},${ll.x} ${ur.y},${ll.x} ${ll.y}))`;

    return ewkt;

  }

  /**
   *
   * Returns the GeoJSON representation of the cell.
   *
   * TODO: THIS IS FIXED TO A EPSG:3035 PROJ4 STRING. THIS CONVERSION
   * STRING SHOULD BE GIVE AS ANOTHER PARAMETER FOR THE GRID WHEN IT
   * SRID IS FORMALIZED
   *
   */
  get geojson(): any {

    const geojson: any = {};

    geojson.type = "Feature";

    geojson.geometry = {};

    geojson.geometry.type = "Polygon";

    // Transformed coordinates from 3035 to 4326
    // TODO: THIS SHOULD BE REVISED AND GENERALIZED

    // The four points that forms the cell

    const corners = this.corners;

    corners.lowerLeft = corners.lowerLeft.reprojectFromProj4Defs("+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs", "EPSG:4326", "4326");

    corners.upperLeft = corners.upperLeft.reprojectFromProj4Defs("+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs", "EPSG:4326", "4326");

    corners.upperRight = corners.upperRight.reprojectFromProj4Defs("+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs", "EPSG:4326", "4326");

    corners.lowerRight = corners.lowerRight.reprojectFromProj4Defs("+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs", "EPSG:4326", "4326");

    geojson.geometry.coordinates = [ [
      corners.lowerLeft.coordsPair,
      corners.upperLeft.coordsPair,
      corners.upperRight.coordsPair,
      corners.lowerRight.coordsPair,
      corners.lowerLeft.coordsPair
    ] ];

    return geojson;

  }

  /**
   *
   * Gets a Polygon from the cell
   *
   */
  get polygon(): Polygon {

    const p: Polygon = new Polygon();

    p.fromGeoJson(this.geojson);

    return p;

  }

  /**
   *
   * Returns the corners of the cell as four Coordinates, starting
   * from the lower left and ending clockwise at the lower right. Returns a data structure in the form:
   *
   * ```JavaScript
   * {
   *  lowerLeft: Coordinate,
   *  upperLeft: Coordinate,
   *  upperRight: Coordinate,
   *  lowerRight: Coordinate
   * }
   * ```
   *
   * @returns         A structure in the aforementioned form.
   *
   */
  get corners(): {
    lowerLeft: Coordinate,
    upperLeft: Coordinate,
    upperRight: Coordinate,
    lowerRight: Coordinate
  } {

    return {

      // Lower left
      lowerLeft: new Coordinate({
        epsg: this.grid.epsg,
        x: this.lowerLeft.x,
        y: this.lowerLeft.y
      }),

      // Upper left
      upperLeft: new Coordinate({
        epsg: this.grid.epsg,
        x: this.lowerLeft.x,
        y: this.upperRight.y
      }),

      // Upper right
      upperRight: new Coordinate({
        epsg: this.grid.epsg,
        x: this.upperRight.x,
        y: this.upperRight.y
      }),

      // Lower right
      lowerRight: new Coordinate({
        epsg: this.grid.epsg,
        x: this.upperRight.x,
        y: this.lowerLeft.y
      })

    }

  }

  /**
   *
   * Gets the scale factor for this cell, that is, the ratio between
   * the area of the cell measured on the WGS84 ellipsoid by Turf and
   * the projected area. This measure is expressed in 1%.
   *
   * @returns The scale factor.
   *
   */
  get scaleFactor(): number { return this.polygon.area / this.area; }

  /**
   *
   * Constructor.
   *
   * @param grid      The grid the cell is defined on.
   * @param zoom      The cell's zoom level.
   * @param x         The cell's x.
   * @param y         The cell's y.
   * @param data      The cell's data.
   * @param offset    The cell's offset, if any.
   *
   */
  constructor({
      grid,
      zoom,
      x,
      y,
      data = {},
      offset = 0
    }: {
      grid: Grid,
      zoom: number,
      x: number,
      y: number,
      data?: any,
      offset?: number
  }) {

    this._zoom = zoom;
    this._x = Math.round(x);
    this._y = Math.round(y);
    this._grid = grid;
    this._data = data;
    this._offset = offset;

  }

  /**
   *
   * Returns subcells in a given zoom level.
   *
   */
  public getSubCells(zoom: number): Cell[] {

    const thisSize = this.grid.zoomLevels[this.zoom].size;
    const targetSize = this.grid.zoomLevels[zoom].size;
    const sizeRatio = thisSize / targetSize;

    const out: Cell[] = [];

    for (
      let x = this.x * sizeRatio ;
      x < (this.x * sizeRatio) + sizeRatio ;
      x++
    ) {

      for (
        let y = this.y * sizeRatio ;
        y < (this.y * sizeRatio) + sizeRatio ;
        y++
      ) {

        out.push(new Cell({
          grid: this.grid,
          zoom: zoom,
          x: x,
          y: y}
        ));

      }

    }

    return out;

  }

  /**
   *
   * Returns true if Coordinate is within the cell.
   *
   * @param {Coordinate} coordinate: The coordinate to test.
   * @returns {boolean}
   *
   */
  public coordinateInCell(coordinate: Coordinate): boolean {

    return this.bbox.coordinateInBbox(coordinate);

  }

  /**
   *
   * Intersects a Turf polygon with this cell.
   *
   * @param polygon       The Turf polygon to intersect.
   *
   */
  public intersectPolygon(polygon: Polygon): any {

    return this.polygon.intersection(polygon);

  }

  /**
   *
   * Returns a Bbox object from the envelope of this cell.
   *
   * @returns {Bbox}
   *
   */
  private _getBbox(): Bbox {

    return new Bbox({
      epsg: this.grid.epsg,
      maxx: this.upperRight.x,
      maxy: this.upperRight.y,
      minx: this.lowerLeft.x,
      miny: this.lowerLeft.y
    } as IBbox);

  }

}
