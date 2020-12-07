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
  protected _zoom: number;
  protected _x: number;
  protected _y: number;

  /**
   *
   * EPSG.
   *
   */
  protected _epsg: string;
  get epsg(): string { return this._epsg }

  /**
   *
   * Cell data.
   *
   */
  protected _data: any;

  /**
   *
   * Cell offset.
   *
   */
  protected _offset: number;

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
  protected _grid: Grid | undefined;
  get grid(): Grid | undefined {

    if (this._grid) {

      return this._grid;

    } else {

      throw new Error("cell: undefined grid");

    }

  }

  set grid(grid: Grid | undefined) { this._grid = grid; }

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
  get sideSize(): number {

    if(this._grid) {

      return +(this._grid.zoomLevels[this.zoom].size);

    } else {

      throw new Error("cell: undefined grid");

    }

  }

  /**
   *
   * Area of the cell.
   *
   */
  get area(): number {

    if (this.sideSize) {

      return this.sideSize * this.sideSize;

    } else {

      throw new Error("cell: undefined grid");

    }
  }

  /**
   *
   * Lower left corner.
   *
   */
  get lowerLeft(): Coordinate {

    if (this._grid) {

      const ox: number = this._grid.origin.x;
      const oy: number = this._grid.origin.y;
      const s: number = this._grid.zoomLevels[this._zoom].size;

      return new Coordinate({
        epsg: this._grid.epsg,
        x: ox + (this._x * s) - this._offset,
        y: oy + (this._y * s) - this._offset
      });

    } else {

      throw new Error("cell: undefined grid");

    }

  }

  /**
   *
   * Upper right corner.
   *
   */
  get upperRight(): Coordinate {

    if (this._grid) {

      const ox: number = this._grid.origin.x;
      const oy: number = this._grid.origin.y;
      const s: number = this._grid.zoomLevels[this._zoom].size;

      return new Coordinate({
        epsg: this._grid.epsg,
        x: ox + ((this._x + 1) * s) + this._offset,
        y: oy + ((this._y + 1) * s) + this._offset
      });

    } else {

      throw new Error("cell: undefined grid");

    }

  }

  /**
   *
   * Returns the center of the cell as a Coordinate.
   *
   */
  get center(): Coordinate {

    if (this._grid) {

      return new Coordinate({
        epsg: this._grid.epsg,
        x: this.lowerLeft.x + (this.sideSize / 2),
        y: this.lowerLeft.y + (this.sideSize / 2)
      });

    } else {

      throw new Error("cell: undefined grid");

    }

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

    if (this._grid) {

      const ll: Coordinate = this.lowerLeft;
      const ur: Coordinate = this.upperRight;

      let ewkt: string = `SRID=${this._grid.epsg};`;

      ewkt += `POLYGON((${ll.x} ${ll.y},${ur.x} ${ll.y},${ur.x} ${ur.y},${ll.x} ${ur.y},${ll.x} ${ll.y}))`;

      return ewkt;

    } else {

      throw new Error("cell: undefined grid");

    }

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
   * Grid ID.
   *
   */
  protected _gridId: string;
  get gridId(): string { return this._gridId }

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

    if (this._grid) {

      return {

        // Lower left
        lowerLeft: new Coordinate({
          epsg: this._grid.epsg,
          x: this.lowerLeft.x,
          y: this.lowerLeft.y
        }),

        // Upper left
        upperLeft: new Coordinate({
          epsg: this._grid.epsg,
          x: this.lowerLeft.x,
          y: this.upperRight.y
        }),

        // Upper right
        upperRight: new Coordinate({
          epsg: this._grid.epsg,
          x: this.upperRight.x,
          y: this.upperRight.y
        }),

        // Lower right
        lowerRight: new Coordinate({
          epsg: this._grid.epsg,
          x: this.upperRight.x,
          y: this.lowerLeft.y
        })

      }

    } else {

      throw new Error("cell: undefined grid");

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
      gridId,
      grid = undefined,
      epsg,
      zoom,
      x,
      y,
      data = {},
      offset = 0
    }: {
      gridId: string;
      grid?: Grid;
      epsg: string;
      zoom: number;
      x: number;
      y: number;
      data?: any;
      offset?: number;
  }) {

    this._zoom = zoom;
    this._x = Math.round(x);
    this._y = Math.round(y);
    this._gridId = gridId;
    this._grid = grid;
    this._epsg = epsg;
    this._data = data;
    this._offset = offset;

  }

  /**
   *
   * Returns subcells in a given zoom level.
   *
   */
  public getSubCells(zoom: number): Cell[] {

    if (this._grid) {

      const thisSize = this._grid.zoomLevels[this.zoom].size;
      const targetSize = this._grid.zoomLevels[zoom].size;
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
            gridId: this._gridId,
            zoom: zoom,
            x: x,
            y: y,
            epsg: this._epsg,
            grid: this._grid
          }));

        }

      }

    return out;

    } else {

      throw new Error("cell: undefined grid");

    }

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
  protected _getBbox(): Bbox {

    if(this._grid) {

      return new Bbox({
        epsg: this._grid.epsg,
        maxx: this.upperRight.x,
        maxy: this.upperRight.y,
        minx: this.lowerLeft.x,
        miny: this.lowerLeft.y
      } as IBbox);

    } else {

      throw new Error("cell: undefined grid");

    }

  }

}
