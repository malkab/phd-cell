import { Coordinate, ICoordinate } from "./coordinate";

import { Polygon, Feature, polygon } from "@turf/helpers";

// Interfaz
export interface IBbox {

  epsg: string;
  minx: number;
  maxx: number;
  miny: number;
  maxy: number;

}

// Class
export class Bbox {

  // EPSG
  private _epsg: string;

  // Lower left coordinate
  private _lowerLeft: Coordinate;

  // Top right coordinate
  private _upperRight: Coordinate;

  /*

      Getters & setters

  */
  get lowerLeft(): Coordinate { return this._lowerLeft; }

  get upperRight(): Coordinate { return this._upperRight; }

  get epsg(): string { return this._epsg; }

  // Returns the min coordinate
  get min(): Coordinate { return this._lowerLeft; }

  // Returns the min coordinate
  get max(): Coordinate { return this._upperRight; }

  // Persistance definition
  get persist(): IBbox {

    return {

      epsg: this._epsg,
      maxx: this._upperRight.x,
      maxy: this._upperRight.y,
      minx: this._lowerLeft.x,
      miny: this._lowerLeft.y

    };

  }

  /*

      Constructor from IBbox

  */
  public constructor(def: IBbox) {

    this._epsg = def.epsg;
    this._lowerLeft = new Coordinate({
        epsg: def.epsg,
        x: def.minx,
        y: def.miny
    });
    this._upperRight = new Coordinate({
        epsg: def.epsg,
        x: def.maxx,
        y: def.maxy
    });

    return this;

  }

  // Get GeoJSON
  get geojson(): Feature<Polygon> {
    return polygon([[
      [ this._lowerLeft.x, this._lowerLeft.y ],
      [ this._upperRight.x, this._lowerLeft.y ],
      [ this._upperRight.x, this._upperRight.y ],
      [ this._lowerLeft.x, this._upperRight.y ],
      [ this._lowerLeft.x, this._lowerLeft.y ]]]);
  }

  // Get PostGIS GeoJSON
  get pggeojson(): any { return this.geojson.geometry; }

  /*

    Checks if a coordinate is inside the bbox

    coordinate: Coordinate: The coordinate to check

  */
  /**
   *
   * Tests if the given coordinate is within the bounding box.
   *
   * @param {Coordinate} coordinate: The coordinate to test.
   * @returns {boolean}
   *
   */
  public coordinateInBbox(coordinate: Coordinate): boolean {

    if (coordinate.x > this._lowerLeft.x && coordinate.x < this._upperRight.x) {

      if (coordinate.y > this._lowerLeft.y && coordinate.y < this._upperRight.y) {

        return true;

      } else {

        return false;

      }

    } else {

      return false;

    }

  }

}
